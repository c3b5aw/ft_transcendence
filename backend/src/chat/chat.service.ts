import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { createHash } from 'crypto';
import { Response } from 'express';
import { Server } from 'socket.io';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Channel, ChannelUser } from './entities/channel.entity';
import { ChatMessage } from './entities/message.entity';
import { UserRole } from 'src/users/entities/roles.enum';
import { ModerationFlow } from './dto/moderationFlow.interface';
import { FriendStatus } from 'src/friends/entities/status.enum';
import { RequestError, WsError } from './dto/errors.enum';

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

	server: Server;

	/*
		LOG IN/OUT FLOW
	*/

	async setServer(server: Server) {
		this.server = server;
	}

	async wsLogin(client: Socket): Promise<number> {
		/* Find cookie */
		if ( !client.handshake.headers.hasOwnProperty('cookie')
		|| !client.handshake.headers.cookie)
			return 0;

		const cookies = client.handshake.headers.cookie;
		const cookie = cookies.split(';').find( c => c.trim().startsWith('access_token='));
		if (!cookie)
			return 0;

		/* Verify token from cookie */
		const accessToken = cookie.split('=')[1];
		const payload = this.jwtService.verify(accessToken, {
			ignoreExpiration: false,
		});

		/* Get User from DB */
		const user: User = await this.usersService.findOneByID( payload.sub );
		if (!user || user.role === UserRole.BANNED)
			return 0;

		/* Update user connected */
		await this.usersService.updateUserConnect(user, true);

		/* Add client to global clients */
		global.clients[client.id] = user.id;

		return user.id;
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
		userChannel.muted = new Date(0);

		return this.userChannelRepository.save(userChannel);
	}

	async setChannelUserBan(userID: number, channelID: number, bool: boolean): Promise<void> {
		const joined: boolean = await this.isUserInChannel(userID, channelID);
		if (!joined)
			return;
		
		await this.userChannelRepository.update(
			{ user_id: userID, channel_id: channelID },
			{ role: bool ? UserRole.BANNED : UserRole.MEMBER },
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
		
		ret.channel = await this.findChannelByName(channelName);
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
		WS FLOW
	*/

	async wsParseJSON(client: Socket, data: string): Promise<{}> {
		try {
			return JSON.parse(data);
		} catch (e) {
			client.emit('onError', { error: WsError.INVALID_JSON });
			return null;
		}
	}

	async wsFatalUserNotFound(client: Socket) {
		client.emit('onError', { error: WsError.USER_NOT_FOUND });
		client.disconnect();
	}

	async wsSendMessageToChannel(client_id: number, message: string, channel: Channel) {
		/* Resolve userID by socketID */
		const user: User = await this.usersService.findOneByID(client_id);
		if (!user)
			return;
		
		/* Save message to database */
		const msg: ChatMessage = new ChatMessage();
		msg.user_id = user.id;
		msg.channel_id = channel.id;
		msg.announcement = false;
		msg.content = message;
		msg.timestamp = new Date();

		await this.messagesRepository.save(msg);

		/* Send message to all clients in channel */
		this.server.to('#' + channel.id).emit('channel::message', {
			user: user.login,
			content: msg.content,
			announcement: false,
			timestamp: msg.timestamp,
		});
	}

	async wsJoinChannel(client: Socket, channel: Channel, firstTime: boolean) {
		const userID: number = await this.getUserIdBySocket(client);
		if (!userID)
			return this.wsFatalUserNotFound(client);

		const user: User = await this.usersService.findOneByID(userID);
		if (!user)
			return this.wsFatalUserNotFound(client);

		/* Make socket join channel */
		client.join('#' + channel.id);

		/* Send user joined to user */
		client.emit('onSuccess', {
			message: 'joined channel: #' + channel.name,
		})

		/* Send user joined to whole channel */
		this.server.to('#' + channel.id).emit('channel:joined', {
			channel: channel,
			login: user.login,
		});

		/* If first time, save channel join + tell you joined */
		if (firstTime) {
			await this.addUserToChannel(user.id, channel.id, UserRole.MEMBER);

			await this.wsSendAnnouncementToChannel(channel.id, 
				user.login + ' joined this channel.');
		}
	}

	async wsLeaveChannel(client: Socket, channel: Channel) {
		const userID: number = await this.getUserIdBySocket(client);
		if (!userID)
			return this.wsFatalUserNotFound(client);

		const user: User = await this.usersService.findOneByID(userID);
		if (!user)
			return this.wsFatalUserNotFound(client);

		/* Remove in database */
		await this.removeUserFromChannel(user.id, channel.id);

		/* Leave socket room */
		client.leave('#' + channel.id);

		/* Stream left event to channel */
		this.server.to('#' + channel.id).emit('channel:left', {
			channel: channel,
			login: user.login,
		});

		/* Stream message left to channel */
		await this.wsSendAnnouncementToChannel(channel.id, 
			user.login + ' left this channel.');

		/* Send success to user */
		client.emit('onSuccess', {
			message: 'left channel: #' + channel.name,
		})
	}

	async wsSendAnnouncementToChannel(channelID: number, message: string) {
		/* Save message to database */
		const msg: ChatMessage = new ChatMessage();
		msg.user_id = 0;
		msg.channel_id = channelID;
		msg.announcement = true;
		msg.content = message;
		msg.timestamp = new Date();

		await this.messagesRepository.save(msg);
		
		/* Send message to all clients in channel */
		this.server.to('#' + channelID).emit('channel::message', {
			user: 'Server',
			content: msg.content,
			announcement: msg.announcement,
			timestamp: msg.timestamp,
		});
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

	async getChannelUsers(channelID: number): Promise<ChannelUser[]> {
		return this.userChannelRepository.query(`
			SELECT channel.user_id as id, channel.muted, channel.role, 
					users.login, users.connected
			FROM channels_users as channel
			INNER JOIN users ON channel.user_id = users.id
			WHERE channel_id = ${channelID}
		`)
	}

	async getUserRoleInChannel(userID: number, channelID: number): Promise<UserRole> {
		const user = await this.userChannelRepository.findOne({
			where: { user_id: userID, channel_id: channelID },
		});

		if (!user)
			return null;
		if (user.role === UserRole.BANNED)
			return UserRole.BANNED;
		if (user.muted > new Date())
			return UserRole.MUTED;
		return user ? user.role : null;
	}

	async getUserChannels(userID: number) {
		return this.userChannelRepository.find({
			where: { user_id: userID },
		});
	}

	async getChannelPasswordHash(channelID: number): Promise<string> {
		const channel = await this.channelsRepository.findOne(channelID);
		if (!channel)
			return undefined;
		return channel.password;
	}
		

	/*
		FINDER
	*/

	async findChannelByName(name: string): Promise<Channel> {
		return this.channelsRepository.findOne({
			where: { name: name },
			select: [ 'id', 'name', 'private', 'tunnel', 'owner_id' ],
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
		/* Delete messages that match channel.id */
		await this.messagesRepository.delete({ channel_id: channel.id });
		
		/* Delete userChannel tree */
		await this.userChannelRepository.delete({ channel_id: channel.id });
		
		/* Finally delete channel */
		await this.channelsRepository.delete(channel);
	}

	async deleteChannelPassword(channel: Channel): Promise<void> {
		await this.channelsRepository.update(channel.id, {
				password: null, private: false,
		});
	}

	async removeUserFromChannel(userID: number, channelID: number): Promise<void> {
		await this.userChannelRepository.delete({ user_id: userID, channel_id: channelID });
	}

	/*
		BOOL
	*/
	
	async isUserInChannel(userID: number, channelID: number): Promise<boolean> {
		const user = await this.userChannelRepository.findOne({
			where: { user_id: userID, channel_id: channelID },
		});

		if (!user || user.role === UserRole.BANNED)
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