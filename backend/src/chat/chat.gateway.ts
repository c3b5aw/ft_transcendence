import { WebSocketGateway, WebSocketServer, SubscribeMessage, 
		MessageBody, ConnectedSocket, OnGatewayConnection,
		OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { createHash } from 'crypto';

import { ChatService } from './chat.service';

@WebSocketGateway({  namespace: '/chat', cors: { origin: '*' }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChatGateway');

	constructor(private readonly chatService: ChatService) {}

	afterInit() {
		this.logger.log('ChatGateway initialized');
	}

	async handleConnection( client: Socket ) {
		const uid: number = await this.chatService.wsLogin(client);
		if (!uid || uid === 0)
			return client.disconnect();
	
		const channels = await this.chatService.getUserChannels(uid);
		if (!channels)
			return;

		for (const channel of channels) {
			this.server.to('#' + channel.id).emit('channelConnected', {
				channel: channel.id,
				user: uid,
			});
		}
	}

	async handleDisconnect( client: Socket ) {
		await this.chatService.wsLogout(client);

		const client_id = await this.chatService.getUserIdBySocket(client);
		if (!client_id || client_id === null)
			return;

		const channels = await this.chatService.getUserChannels(client_id);
		if (!channels)
			return;

		for (const channel of channels) {
			this.server.to('#' + channel.id).emit('channelDisconnected', {
				channel: channel.id,
				user: client_id,
			});
		}
	}

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
	}
}