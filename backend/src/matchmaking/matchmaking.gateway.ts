import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect,
		WebSocketGateway, WebSocketServer,
		SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { WsGuard } from 'src/ws/guards/ws.guard';
import { WSClient } from 'src/ws/datastructures/wsclient.struct';
import { MatchmakingService } from './matchmaking.service';

import { User } from 'src/users/entities/user.entity';
import { MatchType } from 'src/matchs/entities/types.enum';
import { WS_parse } from 'src/ws/parse';

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
	}

	async handleDisconnect(client: WSClient) {
		if (!client.user)
			return;

		await this.matchMakingService.leaveQueue(client);
	}

	@SubscribeMessage('matchmaking::join')
	async matchmakingJoin(client: WSClient, body: string) {
		const { match_type, room } = await WS_parse(body);

		if (!match_type)
			return client.emit('onError', `match_type is required`);
		if (match_type === MatchType.MATCH_NORMAL && !room)
			return client.emit('onError', `room is required`);

		if (match_type === MatchType.MATCH_NORMAL) {
			await this.matchMakingService.joinNormalQueue(client, room);
		} else if (match_type === MatchType.MATCH_RANKED) {
			await this.matchMakingService.joinRankedQueue(client);
		}
	}

	@SubscribeMessage('matchmaking::leave')
	async matchmakingLeave(client: WSClient) {
		await this.matchMakingService.leaveQueue(client);
	}
}