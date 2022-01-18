import { WebSocketGateway, WebSocketServer, SubscribeMessage, 
		MessageBody, ConnectedSocket, OnGatewayConnection,
		OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

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
		const state: boolean = await this.chatService.wsLogin(client);
		if (!state)
			return client.disconnect();
	
		// send connected to joinedChannels
	}

	async handleDisconnect( client: Socket ) {
		await this.chatService.wsLogout(client);

		// send disconnect to joinedChannels
	}

	@SubscribeMessage('channelJoin')
	async joinChannel( @MessageBody() data: any, @ConnectedSocket() client: Socket ) {
		console.log(client);
		// this.chatService.sendAnnouncementToChannel("channelJoined", client.login);

		// SEND channelJoined with client.login
	}
	@SubscribeMessage('channelLeave')
	async leaveChannel( @MessageBody() data: any, @ConnectedSocket() client: Socket ) {
		// this.chatService.sendAnnouncementToChannel("channelLeft", client.login);

		// SEND channelLeft with client.login
	}
	@SubscribeMessage('sendMessage')
	async sendMessageToChannel( @MessageBody() data: any, @ConnectedSocket() client: Socket ) {
		// this.chatService.sendMessageToChannel(data.channel, data.message, client.login);
	
		// SEND onMessage with [data.channel, data.message]
	}
}