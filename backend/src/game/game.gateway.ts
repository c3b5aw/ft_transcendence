import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, 
		SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server } from 'socket.io';

import { WS_parse, WsGuard, WSClient } from 'src/ws';

import { User } from 'src/users/entities/user.entity';

import { GameService } from './game.service';
import { GameMoves } from './objects/moves.enums';

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

	async handleConnection(client: WSClient) {
		const user: User = await this.gameService.verifyUser(client);
		if (!user)
			return;
		
		await this.gameService.reconnectToGame(client);
	}

	async handleDisconnect(client: WSClient) {
		if (!client.user)
			return;

		await this.gameService.disconnectFromGame(client);
	}

	@SubscribeMessage('game::join')
	async gameJoin(client: WSClient, body: string) {
		const json = await WS_parse(body);
		if (!json)
			return client.emit('onError', { error: 'invalid body' });

		const { hash } = json;
		this.gameService.connectToGame(client, hash);
	}

	@SubscribeMessage('game::pause')
	async gamePause(client: WSClient,) {
		await this.gameService.handleGamePause(client);
	}

	@SubscribeMessage('game::paddle::move::up')
	async gamePaddleMoveUp(client: WSClient) {
		await this.gameService.handlePaddleMove(client, GameMoves.MOVE_UP);
	}

	@SubscribeMessage('game::paddle::move::down')
	async gamePaddleMoveDown(client: WSClient) {
		await this.gameService.handlePaddleMove(client, GameMoves.MOVE_DOWN);
	}

	@SubscribeMessage('game::paddle::move::stop')
	async gamePaddleMoveStop(client: WSClient) {
		await this.gameService.handlePaddleMove(client, GameMoves.MOVE_STOP);
	}
}