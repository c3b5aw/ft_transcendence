import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { createHash } from 'crypto';
import { Response } from 'express';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Channel, ChannelUser } from './entities/channel.entity';
import { ChatMessage } from './entities/message.entity';
import { UserRole } from 'src/users/entities/roles.enum';
import { ModerationFlow } from './dto/moderationFlow.class';
import { FriendStatus } from 'src/friends/entities/status.enum';
import { RequestError } from './dto/errors.enum';

@Injectable()
export class ChatService {

	constructor(
		@InjectRepository(Channel) 
		private readonly channelsRepository: Repository<Channel>,
		
		@InjectRepository(ChannelUser)
		private readonly userChannelRepository: Repository<ChannelUser>,

		@InjectRepository(ChatMessage)
		private readonly messagesRepository: Repository<ChatMessage>,

		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
	) {
		global.clients = {};
	}

	/*
		LOG IN/OUT FLOW
	*/

	async wsLogin(client: Socket): Promise<boolean> {
		/* Find cookie */
		if ( !client.handshake.headers.hasOwnProperty('cookie')
		|| !client.handshake.headers.cookie)
			return false;

		const cookies = client.handshake.headers.cookie;
		const cookie = cookies.split(';').find( c => c.trim().startsWith('access_token='));
		if (!cookie)
			return false;

		/* Verify token from cookie */
		const accessToken = cookie.split('=')[1];
		const payload = this.jwtService.verify(accessToken, {
			ignoreExpiration: false,
		});

		/* Get User from DB */
		const user: User = await this.usersService.findOneByID( payload.sub );
		if (!user || user.banned)
			return false;

		/* Update user connected */
		await this.usersService.updateUserConnect(user, true);

		/* Add client to global clients */
		global.clients[client.id] = user.id;

		return true;
	}

	async wsLogout(client: Socket) {
		/* Resolve userID by socketID */
		const userID: number = await this.getUserIdBySocket(client);
		if (!userID)
			return;

		const user: User = await this.usersService.findOneByID(userID);

		/* Update user connected */
		await this.usersService.updateUserConnect(user, false);

		/* Remove client from global clients */
		delete global.clients[client.id];
	}

	/*
		CHANNEL USERS FLOW
	*/

	async addUserToChannel(userID: number, channelID: number, role: UserRole): Promise<ChannelUser> {
		const userChannel = new ChannelUser();
		
		userChannel.role = role;
		userChannel.user_id = userID;
		userChannel.channel_id = channelID;
		userChannel.banned = false;
		userChannel.muted = new Date(0);

		return this.userChannelRepository.save(userChannel);
	}

	async setChannelUserBan(userID: number, channelID: number, bool: boolean): Promise<void> {
		const joined: boolean = await this.isUserInChannel(userID, channelID);
		if (!joined)
			return;
		
		await this.userChannelRepository.update(
			{ user_id: userID, channel_id: channelID },
			{ banned: bool },
		);
	}

	async setUserChannelModerator(userID: number, channelID: number, bool: boolean): Promise<void> {
		const joined: boolean = await this.isUserInChannel(userID, channelID);
		if (!joined)
			return;

		await this.userChannelRepository.update(
			{ user_id: userID, channel_id: channelID },
			{ role: bool ? UserRole.MODERATOR : UserRole.MEMBER },
		);
	}

	async kickUserFromChannel(userID: number, channelID: number): Promise<void> {
		const user = await this.userChannelRepository.findOne({
			where: { user_id: userID, channel_id: channelID },
		});

		if (!user)
			return;

		await this.userChannelRepository.delete(user.id);
	}

	async muteUserInChannel(userID: number, channelID: number, until: Date): Promise<void> {
		const joined: boolean = await this.isUserInChannel(userID, channelID);
		if (!joined)
			return;

		await this.userChannelRepository.update(
			{ user_id: userID, channel_id: channelID },
			{ muted: until },
		);
	}

	async moderationFlow(reqUserId: number, targetLogin: string,
								channelName: string, resp: Response)
							: Promise<ModerationFlow> {
		let ret: ModerationFlow = {
			err: true,
			target: null,
			role: null,
			channel: null,
		}
		
		ret.channel = await this.findOneChannelByName(channelName);
		if (!ret.channel) {
			resp.status(404).json({ error: RequestError.CHANNEL_NOT_FOUND });
			return ret;
		}

		ret.role = await this.getUserRoleInChannel(reqUserId, ret.channel.id);
		if (ret.role !== UserRole.MODERATOR && ret.role !== UserRole.ADMIN) {
			resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });
			return ret;
		}

		ret.target = await this.usersService.findOneByLogin(targetLogin);
		if (!ret.target) {
			resp.status(404).json({ error: RequestError.USER_NOT_FOUND });
			return ret;
		}

		const joined: boolean = await this.isUserInChannel(
				ret.target.id, ret.channel.id);
		if (!joined) {
			resp.status(404).json({ error: RequestError.USER_NOT_IN_CHANNEL });
			return ret;
		}

		ret.err = false;
		return ret;
	}

	/*
		GETTERS
	*/

	async getUserIdBySocket(client: Socket): Promise<number> {
		/*
			Resolve userID using global clients variable shared 
				accross all instances of chatServices
		*/
		const userID = global.clients[client.id];
		return userID ? parseInt(userID) : null;
	}

	async getChannels(): Promise<Channel[]> {
		return this.channelsRepository.find({
			where: { tunnel: false },
			select: [ 'id', 'name', 'private' ],
		});
	}

	async getChannelMessages(selfID: number, channelID: number): Promise<any> {
		return getManager().query(`
			SELECT chat.*, users.login
			FROM chat_messages as chat
			LEFT JOIN users ON chat.user_id = users.id
			WHERE chat.channel_id = ${channelID} AND chat.user_id NOT IN (
				SELECT friend_id FROM friends 
				WHERE friends.status = '${FriendStatus.STATUS_BLOCKED}'
				AND friends.user_id = ${selfID}
			) AND chat.user_id NOT IN (
				SELECT user_id FROM friends
				WHERE friends.status = '${FriendStatus.STATUS_BLOCKED}'
				AND friends.friend_id = ${selfID}
			)
			ORDER BY chat.timestamp ASC
		`);
	}

	async getUserRoleInChannel(userID: number, channelID: number): Promise<UserRole> {
		const user = await this.userChannelRepository.findOne({
			where: { user_id: userID, channel_id: channelID },
		});

		if (!user)
			return null;
		if (user.banned)
			return UserRole.BANNED;
		return user ? user.role : null;
	}

	/*
		FINDER
	*/

	async findOneChannelByName(name: string): Promise<Channel> {
		return this.channelsRepository.findOne({
			where: { name: name },
			select: [ 'id', 'name', 'private', 'tunnel' ],
		});
	}

	/*
		UPDATER
	*/
	
	async updateChannelPassword(channel: Channel): Promise<Channel> {
		if (channel.private)
			channel.password = createHash('md5').update(channel.password).digest('hex');
		return this.channelsRepository.save(channel);
	}

	/*
		CREATER
	*/

	async createChannel(channel: Channel): Promise<Channel> {
		if (channel.private)
			channel.password = createHash('md5').update(channel.password).digest('hex');
		return this.channelsRepository.save(channel);
	}

	/*
		DELETER
	*/

	async deleteChannel(channel: Channel): Promise<void> {
		await this.channelsRepository.delete(channel);
	}

	async deleteChannelPassword(channel: Channel): Promise<void> {
		await this.channelsRepository.update(channel.id, {
				password: null, private: false,
		});
	}

	/*
		BOOL
	*/
	
	async isUserInChannel(userID: number, channelID: number): Promise<boolean> {
		const user = await this.userChannelRepository.findOne({
			where: { user_id: userID, channel_id: channelID },
		});

		if (!user || user.banned)
			return false;
		return true;
	}

	async isUniqueChannelName(name: string): Promise<boolean> {
		const channel = await this.channelsRepository.findOne({
			where: { name: name },
		});

		return !channel;
	}
}