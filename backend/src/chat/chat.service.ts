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
import { UserRole } from 'src/users/entities/roles.enum';
import { UserStatus } from 'src/users/entities/status.enum';

import { FriendStatus } from 'src/friends/entities/status.enum';

import { Channel, ChannelUser } from './entities/channel.entity';
import { ChatMessage } from './entities/message.entity';

import { RequestError, WsError } from './dto/errors.enum';
import { CreateChannelDto } from './dto/createChannel.dto';
import { ModerationFlow } from './dto/moderationFlow.interface';
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
		if (!client.handshake.headers.hasOwnProperty('cookie') || !client.handshake.headers.cookie) {
			client.emit('onError', { error: WsError.NO_COOKIE }); return 0;
		}

		const cookies = client.handshake.headers.cookie;
		const cookie = cookies.split(';').find( c => c.trim().startsWith('access_token='));
		if (!cookie) {
			client.emit('onError', { error: WsError.ACCESS_TOKEN_NOT_FOUND }); return 0;
		}

		/* Verify token from cookie */
		const accessToken = cookie.split('=')[1];

		let payload: any = {};
		try {
			payload = this.jwtService.verify(accessToken, { ignoreExpiration: false });
		} catch (e) {
			client.emit('onError', { error: WsError.ACCESS_TOKEN_INVALID }); return 0;
		}

		/* Get User from DB */
		const user: User = await this.usersService.findOneByID( payload.sub );
		if (!user) {
			client.emit('onError', { error: WsError.USER_NOT_FOUND }); return 0;
		}
			 
		if (user.role === UserRole.BANNED) {
			client.emit('onError', { error: WsError.USER_BANNED }); return 0;
		}

		/* Update user connected */
		await this.usersService.updateUserConnect(user, UserStatus.ONLINE);

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
		await this.usersService.updateUserConnect(user, UserStatus.OFFLINE);

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

	async sendEventToUser(userID: number, event: string, data: any) {
		/* Find user in global clients, if exists, send event */
		const userSocketID: string = Object.keys(global.clients).find( 
			key => global.clients[key] === userID);
		if (userSocketID)
			this.server.to(userSocketID).emit(event, data);
	}

	async sendEventToChannel(channel: Channel, event: string, data: any) {
		const channelSerialized: any = {
			id: channel.id,
			name: channel.name,
		}

		if (data === {})
			this.server.to('#' + channel.id).emit(event, { channel: channelSerialized });
		else
			this.server.to('#' + channel.id).emit(event, { channel: channelSerialized, data });
	}

	async setChannelUserBan(user: User, channel: Channel, bool: boolean): Promise<void> {
		await this.userChannelRepository.update(
			{ user_id: user.id, channel_id: channel.id },
			{ role: bool ? UserRole.BANNED : UserRole.MEMBER });

		await this.sendEventToUser(user.id, 'channel::onBan', {
			channel: { id: channel.id, name: channel.name },
			banned: bool });
		await this.sendEventToChannel(channel, 'channel::membersReload', {});

		const alert = `${user.login} has been ${bool ? 'banned' : 'unbanned'}`;
		await this.wsSendAnnouncementToChannel(channel, alert);
	}

	async setUserChannelModerator(user: User, channel: Channel, bool: boolean): Promise<void> {
		await this.userChannelRepository.update(
			{ user_id: user.id, channel_id: channel.id },
			{ role: bool ? UserRole.MODERATOR : UserRole.MEMBER });

		await this.sendEventToUser(user.id, 'channel::onRoleUpdate', {
			channel: { id: channel.id, name: channel.name },
			role: bool ? UserRole.MODERATOR : UserRole.MEMBER });

		const alert = `${user.login} has been ${bool ? 'promoted' : 'demoted'} to ${bool ? 'moderator' : 'member'}`;
		await this.wsSendAnnouncementToChannel(channel, alert);
	}

	async kickUserFromChannel(user: any, channel: Channel): Promise<void> {		
		const userChannel = await this.userChannelRepository.findOne({
			where: { user_id: user.id, channel_id: channel.id }});
		if (!user)
			return;

		await this.sendEventToUser(user.id, 'channel::onKick', { channel: { id: channel.id, name: channel.name }});
		await this.sendEventToChannel(channel, 'channel::membersReload', {});

		await this.userChannelRepository.delete(userChannel);

		await this.wsSendAnnouncementToChannel(channel, `${user.login} has been kicked`);
	}

	async muteUserInChannel(user: User, channel: Channel, until: Date): Promise<void> {
		await this.userChannelRepository.update(
			{ user_id: user.id, channel_id: channel.id },
			{ muted: until });

		await this.sendEventToUser(user.id, 'channel::onMute', {
			channel: { id: channel.id, name: channel.name }, 'until': until });

		await this.wsSendAnnouncementToChannel(channel, `${user.login} has been muted`);
	}

	async moderationFlow(reqUserId: number, targetLogin: string,
						channelName: string, resp: Response) : Promise<ModerationFlow>
	{
		let ret: ModerationFlow = { err: true, target: null,
			role: null, channel: null };
		
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
			channel: { id: channel.id, name: channel.name },
			message: {
				user: user.login, content: msg.content,
				announcement: false, timestamp: msg.timestamp,
			}});
	}

	async wsJoinChannel(client: Socket, channel: Channel, firstTime: boolean) {
		const userID: number = await this.getUserIdBySocket(client);
		if (!userID)
			return this.wsFatalUserNotFound(client);

		const user: User = await this.usersService.findOneByID(userID);
		if (!user)
			return this.wsFatalUserNotFound(client);

		/* If first time, save channel join + tell you joined */
		if (firstTime) {
			await this.addUserToChannel(user.id, channel.id, UserRole.MEMBER);

			await this.wsSendAnnouncementToChannel(channel, user.login + ' joined this channel.');
		}

		/* Make socket join channel */
		client.join('#' + channel.id);

		/* Send user success joined */
		client.emit('channel::onJoin', { id: channel.id, name: channel.name });

		/* Send user joined to whole channel */
		await this.sendEventToChannel(channel, "channel::membersReload", {});
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
		await this.wsSendAnnouncementToChannel(channel, user.login + ' left this channel.');

		/* Send success to user */
		client.emit('onSuccess', {
			message: 'left channel: #' + channel.name,
		})
	}

	async wsSendAnnouncementToChannel(channel: Channel, message: string) {
		/* Save message to database */
		const msg: ChatMessage = new ChatMessage();
		msg.user_id = 0;
		msg.channel_id = channel.id;
		msg.announcement = true;
		msg.content = message;
		msg.timestamp = new Date();

		await this.messagesRepository.save(msg);
		
		/* Send message to all clients in channel */
		await this.sendEventToChannel(channel, 'channel::message', { message: {
			user: 'Server', content: msg.content,
			announcement: msg.announcement, timestamp: msg.timestamp }});
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
		return this.channelsRepository.find({ where: { tunnel: false },
			select: [ 'id', 'name', 'private', 'owner_id', 'tunnel' ] });
	}

	async getJoinedChannels(userID: number): Promise<Channel[]> {
		return this.channelsRepository.query(`
			SELECT channels.id, channels.name, channels.tunnel, 
				channels.private, channels.owner_id
			FROM channels_users AS users
			INNER JOIN channels ON users.channel_id = channels.id
			WHERE user_id = ${userID}
		`);
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
					users.login, users.status
			FROM channels_users as channel
			INNER JOIN users ON channel.user_id = users.id
			WHERE channel_id = ${channelID}
		`)
	}

	async getChannelModerators(channelID: number): Promise<ChannelUser[]> {
		return this.userChannelRepository.query(`
			SELECT channel.user_id as id, channel.muted, channel.role, 
					users.login, users.status
			FROM channels_users as channel
			INNER JOIN users ON channel.user_id = users.id
			WHERE channel_id = ${channelID} AND (
				channel.role = '${UserRole.MODERATOR}' OR 
				channel.role = '${UserRole.ADMIN}'
			)
		`)
	}

	async getUserRoleInChannel(userID: number, channelID: number): Promise<UserRole> {
		const user = await this.userChannelRepository.findOne({
			where: { user_id: userID, channel_id: channelID }});

		if (!user) return null;
		else if (user.role === UserRole.BANNED) return UserRole.BANNED;
		else if (user.muted > new Date()) return UserRole.MUTED;
		return user ? user.role : null;
	}

	async getUserChannels(userID: number) {
		return this.userChannelRepository.find({ where: { user_id: userID } });
	}

	async getChannelPasswordHash(channelID: number): Promise<string> {
		const channel = await this.channelsRepository.findOne(channelID);
		if (!channel) return undefined;
		return channel.password;
	}
		

	/*
		FINDER
	*/

	async findChannelByName(name: string): Promise<Channel> {
		return this.channelsRepository.findOne({
			where: { name: name },
			select: [ 'id', 'name', 'private', 'tunnel', 'owner_id' ] });
	}

	/*
		UPDATER
	*/
	
	async updateChannelPassword(channel: Channel): Promise<Channel> {
		if (channel.password.length > 0) {
			channel.private = true;
			channel.password = createHash('md5').update(channel.password).digest('hex');
		}
		return this.channelsRepository.save(channel);
	}

	async updateChannelName(channel: Channel, name: string): Promise<Channel> {
		channel.name = name;
		return this.channelsRepository.save(channel);
	}

	/*
		CREATER
	*/

	async createChannel(data: CreateChannelDto, owner: number) : Promise<Channel> {
		const unique: boolean = await this.isUniqueChannelName(data.name);
		if (!unique) return null;
		
		let chan: Channel = new Channel();

		chan.name = data.name;
		chan.password = data.password;
		chan.tunnel = false;
		chan.owner_id = owner;
		chan.private = data.password.length > 0;

		if (chan.private)
			chan.password = createHash('md5').update(chan.password).digest('hex');

		await this.channelsRepository.save(chan);
		await this.addUserToChannel(owner, chan.id, UserRole.ADMIN);

		delete chan.password;
		return chan;
	}

	/*
		DELETER
	*/

	async deleteChannel(channel: Channel): Promise<void> {
		/* Kick all users from channel */
		const users = await this.getChannelUsers(channel.id);
		for (let i = 0; i < users.length; i++) {
			await this.sendEventToUser(users[i].id, 'channel::onKick', {
				channel: { id: channel.id, name: channel.name } });
		}

		/* Delete messages that match channel.id */
		await this.messagesRepository.delete({ channel_id: channel.id });

		/* Delete userChannel tree */
		await this.userChannelRepository.delete({ channel_id: channel.id });
		
		/* Finally delete channel */
		await this.channelsRepository.delete(channel);
	}

	async deleteChannelPassword(channel: Channel): Promise<void> {
		await this.channelsRepository.update(channel.id, { password: null, private: false });
	}

	async removeUserFromChannel(userID: number, channelID: number): Promise<void> {
		await this.userChannelRepository.delete({ user_id: userID, channel_id: channelID });
	}

	/*
		BOOL
	*/
	
	async isUserInChannel(userID: number, channelID: number): Promise<boolean> {
		const user = await this.userChannelRepository.findOne({
			where: { user_id: userID, channel_id: channelID } });

		if (!user || user.role === UserRole.BANNED) return false;
		return true;
	}

	async isUniqueChannelName(name: string): Promise<boolean> {
		const channel = await this.channelsRepository.findOne({ where: { name: name } });

		return !channel;
	}
}