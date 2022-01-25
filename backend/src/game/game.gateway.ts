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

	/*

	- CLIENT SENDS:

	game::join					- make socket join a room (might be spectator)
	game::paddle::move::up		- player move paddle up
	game::paddle::move::down	- player move paddle down
	game::paddle::move::stop	- player stop paddle movement
	game::paddle::power			- player use power
	game::pause					- player request pause

	- SERVER SENDS:

	game::match::onStart	- server start match
	game::match::onPause	- server pause match
	game::match::onEnd		- server end match
	game::match::onScore	- server update score
	game::match::onReset 	- server reset ball with new speed.y

	game::spectator::onJoin		- server add spectator to room
	game::spectator::onLeave	- server remove spectator from room

	game::ball::onCollide		- server update ball vector on collision

	game::paddle::onMove::up	- server move paddle up
	game::paddle::onMove::down	- server move paddle down
	game::paddle::onMove::stop	- server stop paddle
	game::paddle::onPower		- server power paddle

	*/
}