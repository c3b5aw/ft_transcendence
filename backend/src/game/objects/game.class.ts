import { GAME_TICKS_PER_SECOND, GAME_PAUSE_DURATION, GAME_START_MAX_WAIT, 
	GAME_CANVAS_HEIGHT, GAME_BALL_MAX_SPEED, GAME_CANVAS_WIDTH,
	GAME_PLAYER_HEIGHT, GAME_PLAYER_WIDTH, GAME_WIN_SCORE,
	GAME_PAUSE_ON_SCORE_DURATION, GAME_BORDER_SIZE, GAME_START_DELAY,
	GAME_PAUSE_INTERVAL } from './game.constants';
import { GamePlayer, GameBall, GamePause, GameMoves } from './game';

import { User } from 'src/users/entities/user.entity';
import { Match } from 'src/matchs/entities/match.entity';


export class Game {
	public id: number;
	public hash: string;
	private socket: any;

	public players: GamePlayer[] = [];
	private ball: GameBall = new GameBall();
	public pause: GamePause = new GamePause();

	public ended: boolean = false;
	public inTreatment: boolean = false;
	public winner: number = -1;

	private intervalID: any;
	private postGameCallbak: Function = () => {};

	constructor(match: Match, socket: any, postGameCallback: Function) {
		this.socket = socket;

		this.id = match.id;
		this.hash = match.hash;

		this.postGameCallbak = postGameCallback;

		this.players[0] = new GamePlayer(match.player1, 0);
		this.players[1] = new GamePlayer(match.player2, 1);

		this.pause.Pause(null, GAME_START_MAX_WAIT);

		this.intervalID = setInterval(this.onTick.bind(this), 1000 / GAME_TICKS_PER_SECOND);
	}

	private onTick() {
		if (this.ended) return ;

		if (this.pause.paused) {
			const now = new Date().getTime();

			if (this.pause.pausedUntil.getTime() < now)
				this.resume();
			else
				return this.streamPause();
		}

		this.updateBall();
		this.players.forEach(player => { player.update() });
	}

	private resume() {
		this.pause.resume();
		this.emit('game::match::onPause', this.pause.__repr__());
	}

	private updateBall() {
		if (this.ball.y >= GAME_CANVAS_HEIGHT - GAME_BORDER_SIZE || this.ball.y <= GAME_BORDER_SIZE) {
			this.ball.direction = -(this.ball.direction + 180);
			this.emit('game::match::onCollide', { ball: this.ball.__repr__(), obstacle: 'wall' });
		}

		if (this.ball.x > GAME_CANVAS_WIDTH - GAME_PLAYER_WIDTH - GAME_BORDER_SIZE)
			this.collidePlayer(this.players[1]);
		else if (this.ball.x < GAME_PLAYER_WIDTH + GAME_BORDER_SIZE)
			this.collidePlayer(this.players[0]);

		this.ball.x += this.ball.speed * Math.sin(this.ball.direction * Math.PI / 180);
		this.ball.y -= this.ball.speed * Math.cos(this.ball.direction * Math.PI / 180);
	}

	private collidePlayer(player: GamePlayer) {
		if (this.ball.y + this.ball.radius < player.y || this.ball.y - this.ball.radius > player.y + GAME_PLAYER_HEIGHT) {			
			this.score(player.slot === 0 ? this.players[1] : this.players[0]);
		} else {
			this.ball.changeDirection(player);
			if (Math.abs(this.ball.speed) < GAME_BALL_MAX_SPEED)
				this.ball.speedUp();

			this.emit('game::match::onCollide', { ball: this.ball.__repr__(), obstacle: 'player' });
		}
	}
	/*
		GETTERS
	*/

	public isPlayer(userId: number) {
		if (this.players[0] === null)
			return false;

		return this.players.find(p => p.id === userId) !== undefined;
	}

	/*
		REQUESTS
	*/

	public requestSurrender(user: User) {
		const winner: GamePlayer = this.players.find(p => p.id !== user.id);
		if (!winner || winner === undefined)
			return ;

		this.emit('game::match::onSurrender', { winner: winner.__repr__() });

		this.winner = user.id;
		this.end(winner.id);
	}

	public requestPause(user: User) {
		if (this.pause.paused || this.pause.pausesLefts(user.id) <= 0)
			return ;

		this.pause.Pause(user, GAME_PAUSE_DURATION);
	}

	public requestPaddleMove(user: User, move: GameMoves) {
		if (this.pause.paused)
			return ;

		const player = this.players.find(p => p.id == user.id);
		if (player == null)
			return ;

		player.registerMove(move);
		this.streamPaddleMove(user, move);
	}

	/*
		STREAMS
	*/

	private streamPause() {
		const now = new Date().getTime();
		if (now < this.pause.nextUpdate.getTime())
			return ;

		this.pause.nextUpdate = new Date(Date.now() + GAME_PAUSE_INTERVAL);
		this.emit('game::match::onPause', this.pause.__repr__());
	}

	private streamPaddleMove(user: User, move: GameMoves) {
		const player: GamePlayer = this.players.find(p => p.id == user.id);
		if (player === null) return ;

		switch (move) {
			case GameMoves.MOVE_UP:
				this.emit('game::match::onMove::up', player.__repr__() );
				break ;
			case GameMoves.MOVE_DOWN:
				this.emit('game::match::onMove::down', player.__repr__() );
				break ;
			case GameMoves.MOVE_STOP:
				this.emit('game::match::onMove::stop', player.__repr__() );
				break ;
		}
	}

	/*
		SPECTATOR
	*/

	public sendBoard(client: any) {
		client.emit('game::match::onBoard', { game: this.__repr__() });
	}

	public spectatorJoin(user: User) {
		this.emit('game::spectator::onJoin', { game: this.__repr__(), spectator: { id: user.id, login: user.login } });
	}

	public spectatorLeave(user: User) {
		this.emit('game::spectator::onLeave', { game: this.__repr__(), spectator: { id: user.id, login: user.login } });
	}

	public playerJoin(user: User) {
		const player: GamePlayer = this.players.find(p => p.id === user.id);
		if (!player || player === undefined) return ;

		this.players[player.slot].login = user.login;
		this.players[player.slot].ingame = true;

		this.emit('game::match::onJoin', { player: this.players[player.slot].__repr__() });

		if (this.players[0].ingame && this.players[1].ingame)
			this.start();
	}

	private start() {
		if (this.players[1] === null)
			return ;

		this.ball.reset();

		this.pause.Pause(null, GAME_START_DELAY);
		this.emit('game::match::onStart', { game: this.__repr__() });
	}

	private emit(event: string, data: any = {}) {
		this.socket.to(`#GAME-${ this.hash }`).emit(event, data);
	}

	/*
		SCORING
	*/

	private score(player: GamePlayer) {
		player.score++;
		this.emit('game::match::onScore', { player });
		if (player.score >= GAME_WIN_SCORE)
			return this.end(player.id);
		
		this.reset(player.slot);
	}

	/*
		STATES
	*/

	private reset(player_slot: number = Math.random()) {
		this.pause.Pause(null, GAME_PAUSE_ON_SCORE_DURATION);
		this.ball.reset(player_slot);
		this.players[0].reset();
		this.players[1].reset();

		this.emit('game::match::onReset', { ball: this.ball.__repr__() });
	}

	private end(winnerId: number) {
		if (this.winner === -1)
			this.winner = winnerId;

		clearInterval(this.intervalID);

		const winner: GamePlayer = this.players.find(p => p.id === this.winner);

		this.emit('game::match::onEnd', winner !== undefined ? { winner: winner.__repr__() } : { winner: null });
		this.ended = true;

		this.postGameCallbak(this);
	}

	private __repr__() {
		return {
			id: this.id, hash: this.hash,
			players: [
				this.players[0].__repr__(),
				this.players[1].__repr__()
			], ball: this.ball.__repr__(),
			pause: this.pause.__repr__(),
			ended: this.ended,
		}
	}
};