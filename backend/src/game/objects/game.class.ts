import { GAME_TICKS_PER_SECOND, GAME_PAUSE_DURATION, GAME_START_MAX_WAIT, 
	GAME_CANVAS_HEIGHT, GAME_BALL_MAX_SPEED, GAME_CANVAS_WIDTH,
	GAME_PLAYER_HEIGHT, GAME_PLAYER_WIDTH, GAME_WIN_SCORE,
	GAME_PAUSE_ON_SCORE_DURATION, GAME_BORDER_SIZE, GAME_START_DELAY } from './game.constants';
import { GamePlayer, GameBall, GamePause, GameMoves } from './game';

import { User } from 'src/users/entities/user.entity';


export class Game {
	public id: number;
	public hash: string;
	private socket: any;

	public players: GamePlayer[] = [];
	private ball: GameBall = new GameBall();
	public pause: GamePause = new GamePause();

	public ended: boolean = false;
	public inTreatment: boolean = false;

	private intervalID: any;

	constructor(id: number, hash: string, socket: any) {
		this.hash = hash;
		this.id = id;

		this.socket = socket;

		this.init();
	}

	private async init() {
		this.pause.Pause(null, GAME_START_MAX_WAIT);

		this.intervalID = setInterval(this.onTick.bind(this), 1000 / GAME_TICKS_PER_SECOND);
	}

	private onTick() {
		if (this.ended) return ;

		if (this.pause.paused) return this.streamPause();

		this.updateBall();
		this.players.forEach(player => { player.update() });
	}

	private updateBall() {
		if (this.ball.y >= GAME_CANVAS_HEIGHT - GAME_BORDER_SIZE || this.ball.y <= GAME_BORDER_SIZE)
			this.ball.direction = -this.ball.direction;

		if (this.ball.x < GAME_PLAYER_WIDTH + GAME_BORDER_SIZE)
			this.collidePlayer(this.players[0]);
		if (this.ball.x > GAME_CANVAS_WIDTH - GAME_PLAYER_WIDTH - GAME_BORDER_SIZE)
			this.collidePlayer(this.players[1]);

		this.ball.x += this.ball.speed * Math.cos(this.ball.direction * Math.PI / 180);
		this.ball.y += this.ball.speed * Math.sin(this.ball.direction * Math.PI / 180);
	}

	private collidePlayer(player: GamePlayer) {
		if (this.ball.y + this.ball.radius < player.y || this.ball.y - this.ball.radius > player.y + GAME_PLAYER_HEIGHT) {
			return this.score(player);
		} else {
			this.ball.changeDirection(player);
			if (Math.abs(this.ball.speed) < GAME_BALL_MAX_SPEED)
				this.ball.speedUp();

			this.emit('game::match::onCollide', { ball: this.ball });
		}
	}
	/*
		GETTERS
	*/

	public isPlayer(userId: number) {
		if (this.players[0] === null)
			return false;

		return this.players.find(p => p.id === userId) !== null;
	}

	/*
		REQUESTS
	*/

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
		if (this.pause.nextUpdate.getTime() < Date.now())
			return;

		this.pause.nextUpdate = new Date(Date.now() + 100);
		this.emit('game::match::onPause', this.pause);
	}

	private streamPaddleMove(user: User, move: GameMoves) {
		const player: GamePlayer = this.players.find(p => p.id == user.id);
		if (player === null) return ;

		switch (move) {
			case GameMoves.MOVE_UP:
				this.emit('game::match::onMove::up', player.__repr__() );
			case GameMoves.MOVE_DOWN:
				this.emit('game::match::onMove::down', player.__repr__() );
			case GameMoves.MOVE_STOP:
				this.emit('game::match::onMove::stop', player.__repr__() );
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
		this.emit('game::match::onJoin', { player: { id: user.id, login: user.login } });

		if (this.players.find(p => p.id === user.id) !== null) {
			return this.pause.resume();
		} else if (this.players[0] == null) {
			this.players[0] = new GamePlayer(user.id, user.login, 0);
			return ;
		} else if (this.players[1] == null) {
			this.players[1] = new GamePlayer(user.id, user.login, 1);
			this.start();
		}
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
		if (player.score >= GAME_WIN_SCORE)
			return this.end();

		this.emit('game::match::onScore', { player });
		this.reset();
	}

	/*
		STATES
	*/

	private reset() {
		this.pause.Pause(null, GAME_PAUSE_ON_SCORE_DURATION);
		this.ball.reset();
		this.players[0].reset();
		this.players[1].reset();

		this.emit('game::match::onReset', { ball: this.ball });
	}

	private end() {
		clearInterval(this.intervalID);

		this.emit('game::match::onEnd');
		this.ended = true;
	}

	private __repr__() {
		return {
			id: this.id, hash: this.hash,
			players: [
				this.players[0] ? this.players[0].__repr__() : null,
				this.players[1] ? this.players[1].__repr__() : null
			], ball: this.ball.__repr__(),
			pause: this.pause.__repr__(),
			ended: this.ended,
		}
	}
};