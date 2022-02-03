import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';

import { WsGuard, WSClient } from 'src/ws';

import { UsersService } from 'src/users/users.service';
import { UserStatus } from 'src/users/entities/status.enum';

import { MatchsService } from 'src/matchs/matchs.service';
import { Match } from 'src/matchs/entities/match.entity';

import { StatsService } from 'src/stats/stats.service';

import { Game, GameMoves } from './objects/game';

@Injectable()
export class GameService {
	server: Server;
	private logger: Logger = new Logger('GameService');

	constructor(private readonly usersService: UsersService,
		private readonly matchsService: MatchsService,
		private readonly jwtService: JwtService,
		private readonly statsService: StatsService)
	{
		global.users_game = {}
		global.games = {};
	}

	public setServer(server: Server) { this.server = server; }

	/*
		AUTH
	*/

	public async verifyUser(client: WSClient) {
		return WsGuard.verify(client, this.jwtService, this.usersService);
	}

	/*
		CONNECTION
	*/

	public connectToGame(client: WSClient, gameHash: string){
		const game: Game = this.findOnGoinMatchByHash(gameHash);
		if (!game)
			return client.emit('onError', { error: 'game not found' });

		// ToDo: Check if user has joined a room already.
		console.log(`game.service.ts: 'connectToGame': client.rooms: `, client.rooms);

		client.join('#GAME-' + gameHash);
		if (game.isPlayer(client.user.id))
			game.playerJoin(client.user);
		else
			game.spectatorJoin(client.user);
	
		return true;
	}

	public async disconnectFromGame(client: WSClient) {
		const game: Game = await this.findRunningGame(client);
		if (!game)
			return;

		if (game.isPlayer(client.user.id))
			game.requestPause(client.user);
		else
			game.spectatorLeave(client.user);
	}

	public async reconnectToGame(client: WSClient) {
		const game: Game = await this.findRunningGame(client);
		if (!game)
			return;

		this.connectToGame(client, game.hash);
	}

	/*
		GAME INSTANCES
	*/

	private async startGame(match: Match) {
		const game: Game = new Game(match.id, match.hash, this.server.to('#GAME-' + match.hash));
		global.games[match.hash] = game;
		this.logger.log('Game started: ' + match.hash);
	}

	private async postGame(game: Game) {
		if (game.inTreatment)
			return false;

		game.inTreatment = true;
		this.logger.log('Game ended: ' + game.hash);

		let match: Match = await this.matchsService.findOneById(game.id);
		if (!match)
			return this.logger.error(`Game ended: match not found: ${game.hash}`);
		match.finished = true;
		match.duration = new Date().getTime() - match.date.getTime();
		match.player1_score = game.players.find(p => p.id == match.player1).score;
		match.player2_score = game.players.find(p => p.id == match.player2).score;

		match = await this.matchsService.update(match);
		await this.statsService.updateFromMatch(match);

		await this.usersService.updateStatus(match.player1, UserStatus.OFFLINE);
		await this.usersService.updateStatus(match.player1, UserStatus.OFFLINE);

		delete global.games[game.hash];
	}

	/*
		GAME HANDLERS
	*/
	
	public async handleGamePause(client: WSClient) {
		const game: Game = await this.findRunningGame(client);
		if (!game)
			return ;

		if (game.isPlayer(client.user.id))
			game.requestPause(client.user);
		else
			return client.emit('onError', { error: '`game_pause`: not a player' });
	}

	public async handlePaddleMove(client: WSClient, move: GameMoves) {
		const game: Game = await this.findRunningGame(client);
		if (!game)
			return client.emit('onError', { error: '`paddle_move`: not in game' });

		if (!(game.isPlayer(client.user.id)))
			return client.emit('onError', { error: '`paddle_move`: not a player' });

		game.requestPaddleMove(client.user, move);
	}

	/*
		FINDER
	*/

	private findOnGoinMatchByHash(gameHash: string): Game {
		return global.games[gameHash];
	}

	private findOnGoingMatch(client: WSClient): Match {
		const matchHash: string = global.users_game[client.user.id];
		if (!matchHash)
			return null;

		return global.games[matchHash];
	}

	public async findRunningGame(client: WSClient): Promise<Game> {
		let match: Match = this.findOnGoingMatch(client);
		if (!match) {
			match = await this.matchsService.findPendingMatch(client.user.id);
			if (match)
				await this.startGame(match);
		}
		if (!match) {
			client.emit('onError', { error: '`findRunningGame`: no match found' });
			return null;
		}
		const game: Game = global.games[match.hash];
		if (game.ended) {
			this.postGame(game);
			return null;
		}
		return game;
	}
}