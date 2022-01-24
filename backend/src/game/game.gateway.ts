import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, 
		WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';

import { WsGuard } from 'src/ws/guards/ws.guard';
import { WSClient } from 'src/ws/datastructures/wsclient.struct';

import { GameService } from './game.service';

@UseGuards(WsGuard)
@WebSocketGateway({ namespace: '/game', cors: { origin: '*'} })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(private readonly gameService: GameService) {}

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('GameGateway');

	afterInit() {
		this.logger.log('GameGateway initialized');
		this.gameService.setServer(this.server);
	}

	async handleConnection(client: WSClient) {}

	async handleDisconnect(client: WSClient) {}

}