import { WebSocketGateway, WebSocketServer, SubscribeMessage, 
		MessageBody, ConnectedSocket, OnGatewayConnection,
		OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({  namespace: '/chat', cors: { origin: '*' }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChatGateway');

	afterInit() {
		this.logger.log('ChatGateway initialized');
	}

	handleConnection( client: Socket ) {
		this.logger.log(`Client ${client.id} connected`);
	}

	handleDisconnect( client: Socket ) {
		this.logger.log(`Client ${client.id} disconnected`);
	}

}