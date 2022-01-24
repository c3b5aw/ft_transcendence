import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect,
		WebSocketGateway, WebSocketServer,
		SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { WsGuard } from 'src/auth/guards/ws.guard';
import { WSClient } from 'src/ws/datastructures/wsclient.struct';
import { MatchmakingService } from './matchmaking.service';

import { User } from 'src/users/entities/user.entity';

@UseGuards(WsGuard)
@WebSocketGateway({ namespace: '/matchmaking', cors: { origin: '*'} })
export class MatchmakingGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('MatchmakingGateway');

	constructor(private readonly matchMakingService: MatchmakingService) {}

	afterInit() {
		this.logger.log('MatchmakingGateway initialized');
		this.matchMakingService.setServer(this.server);
	}

	async handleConnection(client: WSClient) {
		const user: User = await this.matchMakingService.verifyUser(client);
		if (!user)
			return;

		client.emit('onSuccess', { message: 'welcome to the matchmaking server' });
	}

	async handleDisconnect(client: WSClient) {
		console.log(client.user);
		// console.log('disconnect');
		// if (!client.user)
		// 	console.log('disconnect');
		// remove from matchmaking
	}

	@SubscribeMessage('matchmaking::request')
	async matchmakingRequest(client: WSClient, body: any) {
		console.log(client.user);
		// verify JSON

		// check match type
		// add in queue
		client.emit('ok', "message");
	}

	@SubscribeMessage('matchmaking::cancel')
	async matchmakingCancel(client: WSClient, body: any) {
		// remove from queue
	}

	@SubscribeMessage('matchmaking::accept')
	async matchmakingAccept(client: WSClient, body: any) {
		// remove from queue and redirect to game
	}
}