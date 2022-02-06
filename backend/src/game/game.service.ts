import { ConsoleLogger, Injectable, Logger } from '@nestjs/common';
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

	public connectToGame(client: WSClient, hash: string){
		const game: Game = this.findOnGoingMatchByHash(hash);
		if (!game || game === undefined)
			return client.emit('onError', { error: 'game not found' });

		const room_name = `#GAME-${ hash }`;
		if (!client.rooms.has(room_name)) {
			client.join('#GAME-' + hash);

			if (game.isPlayer(client.user.id))
				game.playerJoin(client.user);
			else
				game.spectatorJoin(client.user);
		}
		game.sendBoard(client);
		return true;
	}

	public async disconnectFromGame(client: WSClient) {
		const game: Game = await this.findRunningGame(client);
		if (!game)
			return;

		if (game.isPlayer(client.user.id)) {
			game.requestPause(client.user);
	
			const player = game.players.find(player => player.id === client.user.id);
			if (player && player !== undefined) {
				game.players[player.slot].ingame = false;
			}
		} else
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
		global.games[match.hash] = new Game(match, this.server);
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

		const date_start = (new Date(match.date)).getTime();
		const date_end = (new Date()).getTime();
		match.duration =  Math.ceil( (date_end - date_start) / (1000 * 60 * 60 * 24));

		match.player1_score = game.players[0].score;
		match.player2_score = game.players[1].score;

		match = await this.matchsService.update(match);

		// move this to matchs service
		// add post processing for achievements
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

	private findOnGoingMatchByHash(gameHash: string): Game {
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
			if (match && !global.games[match.hash])				
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