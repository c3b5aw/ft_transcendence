import { WebSocketGateway, WebSocketServer, SubscribeMessage, 
		MessageBody, ConnectedSocket, OnGatewayConnection,
		OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { createHash } from 'crypto';

import { ChatService } from './chat.service';
<<<<<<< HEAD
=======
import { WsError } from './dto/errors.enum';
import { UserRole } from 'src/users/entities/roles.enum';
>>>>>>> origin/main

@WebSocketGateway({  namespace: '/chat', cors: { origin: '*' }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChatGateway');

	constructor(private readonly chatService: ChatService) {}

	afterInit() {
		this.logger.log('ChatGateway initialized');
<<<<<<< HEAD
=======
		this.chatService.setServer(this.server);
>>>>>>> origin/main
	}

	async handleConnection( client: Socket ) {
		const uid: number = await this.chatService.wsLogin(client);
		if (!uid || uid === 0)
			return client.disconnect();
	
		const channels = await this.chatService.getUserChannels(uid);
		if (!channels)
			return;

		for (const channel of channels) {
<<<<<<< HEAD
			this.server.to('#' + channel.id).emit('channelConnected', {
=======
			this.server.to('#' + channel.id).emit('channel::connect', {
>>>>>>> origin/main
				channel: channel.id,
				user: uid,
			});
		}
	}

<<<<<<< HEAD
	async handleDisconnect( client: Socket ) {
=======
	async handleDisconnect(client: Socket) {
>>>>>>> origin/main
		await this.chatService.wsLogout(client);

		const client_id = await this.chatService.getUserIdBySocket(client);
		if (!client_id || client_id === null)
			return;

		const channels = await this.chatService.getUserChannels(client_id);
		if (!channels)
			return;

		for (const channel of channels) {
<<<<<<< HEAD
			this.server.to('#' + channel.id).emit('channelDisconnected', {
=======
			this.server.to('#' + channel.id).emit('channel::disconnect', {
>>>>>>> origin/main
				channel: channel.id,
				user: client_id,
			});
		}
	}

<<<<<<< HEAD
	@SubscribeMessage('joinChannel')
	async joinChannel( @MessageBody() data: any, @ConnectedSocket() client: Socket ) {
		let payload: any = {};
		try {
			payload = JSON.parse(data);
		} catch (e) {
			console.log(e);
			return client.emit('onError', {
				error: 'invalid_json',
				message: 'unable to join channel',
			});
		}

		const client_id = await this.chatService.getUserIdBySocket(client);
		if (!client_id || client_id === null) {
			client.emit('onError', {
				error: 'invalid_user',
				message: 'user not found',
			});
			return client.disconnect();
		}

		if (!payload.channel) {
			return client.emit('onError', {
				error: 'invalid_data',
				message: 'no channel specified',
			});
		}

		const channel = await this.chatService.findChannelByName(payload.channel);
		if (!channel) {
			return client.emit('onError', {
				error: 'invalid_data',
				message: 'channel not found',
			});
		}

		if (await this.chatService.isUserInChannel(client_id, channel.id)) {
			// stream channelJoined with [channel.id, client.login]

			client.join('#' + channel.id);
			return client.emit('onSuccess', {
				message: 'joined channel',
			});
		}

		const hash = await this.chatService.getChannelPasswordHash(channel.id);
		if (hash === undefined) {
			return client.emit('onError', {
				error: 'server_error',
				message: 'unable to authenticate with channel',
			})
		}
		if (hash === null) {
			// stream channelJoined with [channel.id, client.login]
			// add user to channel in bdd

			client.join('#' + channel.id);
			return client.emit('onSuccess', {
				message: 'joined channel',
			});
		}

		const pwd = createHash('md5').update(payload.password).digest('hex');
		if (pwd !== hash) {
			return client.emit('onError', {
				error: 'invalid_data',
				message: 'invalid password',
			});
		}
		client.join('#' + channel.id);

		// stream channelJoined with [channel.id, client.login]
		// add user to channel in bdd

		return client.emit('onSuccess', {
			message: 'joined channel',
		});
	}

	@SubscribeMessage('leaveChannel')
	async leaveChannel( @MessageBody() data: any, @ConnectedSocket() client: Socket ) {
		// get userID and channelID
		
		// this.chatService.sendAnnouncementToChannel("channelLeft", client.login);

		// SEND channelLeft with client.login
	}
	@SubscribeMessage('sendMessage')
	async sendMessageToChannel( @MessageBody() data: any, @ConnectedSocket() client: Socket ) {
		console.log(client.rooms);
		// this.chatService.sendMessageToChannel(data.channel, data.message, client.login);
	
		// SEND onMessage with [data.channel, data.message]
=======
	@SubscribeMessage('channel::join')
	async joinChannel(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		const payload: any = await this.chatService.wsParseJSON(client, data);
		if (!payload)
			return;

		const client_id = await this.chatService.getUserIdBySocket(client);
		if (!client_id || client_id === null)
			return this.chatService.wsFatalUserNotFound(client);

		if (!payload.channel)
			return client.emit('onError', { error: WsError.CHANNEL_NOT_SPECIFIED });

		const channel = await this.chatService.findChannelByName(payload.channel);
		if (!channel)
			return client.emit('onError', { error: WsError.CHANNEL_NOT_FOUND, });

		if (await this.chatService.isUserInChannel(client_id, channel.id))
			return await this.chatService.wsJoinChannel(client, channel, false);

		const hash = await this.chatService.getChannelPasswordHash(channel.id);
		if (hash === undefined)
			return client.emit('onError', { error: WsError.UNABLE_AUTH_CHANNEL });
		else if (hash === null)
			return await this.chatService.wsJoinChannel(client, channel, true);

		const pwd = createHash('md5').update(payload.password).digest('hex');
		if (pwd !== hash)
			return client.emit('onError', { error: WsError.INVALID_PASSWORD });

		await this.chatService.wsJoinChannel(client, channel, true);
	}

	@SubscribeMessage('channel::leave')
	async leaveChannel(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		const payload: any = await this.chatService.wsParseJSON(client, data);
		if (!payload)
			return;

		if (!payload.channel)
			return client.emit('onError', { error: WsError.CHANNEL_NOT_SPECIFIED });

		const client_id = await this.chatService.getUserIdBySocket(client);
		if (!client_id || client_id === null)
			return this.chatService.wsFatalUserNotFound(client);

		const channel = await this.chatService.findChannelByName(payload.channel);
		if (!channel)
			return client.emit('onError', { error: WsError.CHANNEL_NOT_FOUND, });

		const joined: boolean = await this.chatService.isUserInChannel(client_id, channel.id);
		if (!joined)
			return client.emit('onError', { error: WsError.USER_NOT_IN_CHANNEL });

		await this.chatService.wsLeaveChannel(client, channel);
	}

	@SubscribeMessage('channel::send')
	async sendMessageToChannel(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		const payload: any = await this.chatService.wsParseJSON(client, data);
		if (!payload)
			return;

		if (!payload.channel)
			return client.emit('onError', { error: WsError.CHANNEL_NOT_SPECIFIED });
		if (!payload.message)
			return client.emit('onError', { error: WsError.MESSAGE_NOT_SPECIFIED });

		const channel = await this.chatService.findChannelByName(payload.channel);
		if (!channel)
			return client.emit('onError', { error: WsError.CHANNEL_NOT_FOUND });

		const chanName = `#${channel.id}`;
		if (!client.rooms.has(chanName))
			return client.emit('onError', { error: WsError.USER_NOT_IN_CHANNEL });

		const client_id = await this.chatService.getUserIdBySocket(client);
		if (!client_id || client_id === null)
			return this.chatService.wsFatalUserNotFound(client);

		if (!await this.chatService.isUserInChannel(client_id, channel.id))
			return client.emit('onError', { error: WsError.USER_NOT_IN_CHANNEL });

		const role: UserRole = await this.chatService.getUserRoleInChannel(client_id, channel.id);
		if (role === UserRole.BANNED)
			return client.emit('onError', { error: WsError.USER_BANNED });
		else if (role === UserRole.MUTED)
			return client.emit('onError', { error: WsError.USER_MUTED });

		await this.chatService.wsSendMessageToChannel(client_id, payload.message, channel);
	
		client.emit('onSuccess', { message: 'message sent' });
>>>>>>> origin/main
	}
}