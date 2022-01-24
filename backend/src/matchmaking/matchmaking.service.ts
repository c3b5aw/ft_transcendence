import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Server } from 'socket.io';

import { WsGuard } from 'src/auth/guards/ws.guard';
import { Match } from 'src/matchs/entities/match.entity';
import { MatchType } from 'src/matchs/entities/types.enum';
import { MatchsService } from 'src/matchs/matchs.service';

import { UsersService } from 'src/users/users.service';

import { WSClient } from 'src/ws/datastructures/wsclient.struct';

@Injectable()
export class MatchmakingService {

	constructor(private readonly usersService: UsersService,
		private readonly matchsService: MatchsService,
		private readonly jwtService: JwtService)
	{
		global.mm_clients = {};
		global.queues = {};
	}

	server: Server;

	setServer(server: Server) {
		this.server = server;
	}

	async verifyUser(client: WSClient) {
		return WsGuard.verify(client, this.jwtService, this.usersService);
	}

	/*
		QUEUES
	*/

	async joinQueue(client: WSClient, room: string, queueType: string = 'NORMAL') {
		if (global.mm_clients[client.user.id])
			return client.emit('onError', { error: `already in a queue` });

		client.join(room);

		global.mm_clients[client.user.id] = room;
		
		if (!global.queues[room])
			global.queues[room] = [];
		
		global.queues[room].push(client);
		client.emit('matchmaking::onJoin', { room, match_type: queueType });
	
		this.queueUpdate(room);
	}

	async leaveQueue(client: WSClient) {
		const queue = global.mm_clients[client.user.id];
		if (!queue)
			return client.emit('onError', { error: `not in a queue` });

		client.leave(queue);
		global.queues[queue].splice(global.queues[queue].indexOf(client), 1);
		delete global.mm_clients[client.user.id];

		return client.emit('matchmaking::onLeave', { message: `queue left` });
	}

	async joinNormalQueue(client: WSClient, queueName: string) {
		const room: string = `#MM-NORMAL-${queueName}`;

		return this.joinQueue(client, room);
	}

	async joinRankedQueue(client: WSClient) {
		const { elo } = await this.usersService.getStatsById(client.user.id);
		if (!elo)
			return client.emit('onError', { error: `unable to fetch elo` });

		const roundedElo = Math.round(elo / 100) * 100;
		const roomElo = (roundedElo / 100) % 2 === 0 ? roundedElo - 100 : roundedElo;

		const room = `#MM-RANKED-${roomElo}`;

		return this.joinQueue(client, room, 'RANKED');
	}

	async queueUpdate(room: string) {
		if (!global.queues[room])
			return;

		const queue = global.queues[room];
		if (queue.length < 2)
			return;

		const match_type: MatchType = room.startsWith('#MM-RANKED') ? MatchType.MATCH_RANKED : MatchType.MATCH_NORMAL;
		const match: Match = await this.matchsService.create(queue[0].user.id, queue[1].user.id, match_type);

		// Send match to room
		this.server.to(room).emit('matchmaking::onMatch', { match });

		// remove from queue and clients
		const [user1, user2] = queue;
		global.queues[room] = [];

		delete global.mm_clients[user1];
		delete global.mm_clients[user2];
	}
}