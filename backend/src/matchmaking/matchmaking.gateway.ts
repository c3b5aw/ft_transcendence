import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect,
		WebSocketGateway, WebSocketServer,
		SubscribeMessage } from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { JwtTwoFactorGuard } from 'src/2fa/guards/2fa.guard';
import { WsGuard } from 'src/auth/guards/ws.guard';

@UseGuards(WsGuard)
@WebSocketGateway({ namespace: '/matchmaking', cors: { origin: '*'} })
export class MatchmakingGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('MatchmakingGateway');

	constructor() {}

	afterInit() {
		this.logger.log('MatchmakingGateway initialized');
	}

	async handleConnection(client: Socket) {
		// verify TK
		// check user status
		// add in matchmaking
	}

	async handleDisconnect(client: Socket) {
		// remove from matchmaking		
	}

	@SubscribeMessage('matchmaking::request')
	async matchmakingRequest(client: Socket, data: any) {
		console.log(client);
		// verify JSON

		// check match type
		// add in queue
		client.emit('ok', "message");
	}

	@SubscribeMessage('matchmaking::cancel')
	async matchmakingCancel(client: Socket, data: any) {
		// remove from queue
	}

	@SubscribeMessage('matchmaking::accept')
	async matchmakingAccept(client: Socket, data: any) {
		// remove from queue and redirect to game
	}
}