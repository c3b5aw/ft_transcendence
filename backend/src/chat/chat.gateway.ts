import { WebSocketGateway, WebSocketServer, SubscribeMessage, 
		MessageBody, ConnectedSocket, OnGatewayConnection,
		OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { createHash } from 'crypto';

import { ChatService } from './chat.service';
import { WsError } from './dto/errors.enum';
import { UserRole } from 'src/users/entities/roles.enum';

@WebSocketGateway({  namespace: '/chat', cors: { origin: '*' }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChatGateway');

	constructor(private readonly chatService: ChatService) {}

	afterInit() {
		this.logger.log('ChatGateway initialized');
		this.chatService.setServer(this.server);
	}

	async handleConnection( client: Socket ) {
		const uid: number = await this.chatService.wsLogin(client);
		if (!uid || uid === 0)
			return client.disconnect();
	
		const channels = await this.chatService.getUserChannels(uid);
		if (!channels)
			return;

		for (const channel of channels) {
			this.server.to('#' + channel.id).emit('channel::connect', {
				channel: channel.id,
				user: uid,
			});
		}
	}

	async handleDisconnect(client: Socket) {
		await this.chatService.wsLogout(client);

		const client_id = await this.chatService.getUserIdBySocket(client);
		if (!client_id || client_id === null)
			return;

		const channels = await this.chatService.getUserChannels(client_id);
		if (!channels)
			return;

		for (const channel of channels) {
			this.server.to('#' + channel.id).emit('channel::disconnect', {
				channel: channel.id,
				user: client_id,
			});
		}
	}

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

		if (channel.tunnel)
			return client.emit('onError', { error: WsError.CHANNEL_IS_TUNNEL });

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

		const client_id = await this.chatService.getUserIdBySocket(client);
		if (!client_id || client_id === null)
			return this.chatService.wsFatalUserNotFound(client);

		if (!await this.chatService.isUserInChannel(client_id, channel.id))
			return client.emit('onError', { error: WsError.USER_NOT_IN_CHANNEL });

		const chanName = `#${channel.id}`;
		if (!client.rooms.has(chanName))
			client.join(chanName);

		const role: UserRole = await this.chatService.getUserRoleInChannel(client_id, channel.id);
		if (role === UserRole.BANNED)
			return client.emit('onError', { error: WsError.USER_BANNED });
		else if (role === UserRole.MUTED)
			return client.emit('onError', { error: WsError.USER_MUTED });

		await this.chatService.wsSendMessageToChannel(client_id, payload.message, channel);
	
		client.emit('onSuccess', { message: 'message sent' });
	}
}