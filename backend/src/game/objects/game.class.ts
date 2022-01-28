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

	public players: GamePlayer[];
	private ball: GameBall;
	public pause: GamePause;

	public ended: boolean;
	public inTreatment: boolean;

	private intervalID: any;

	constructor(id: number, hash: string, socket: any) {
		this.hash = hash;
		this.id = id;

		this.ended = false;
		this.inTreatment = false;

		this.socket = socket;
		this.players[0] = null;
		this.players[1] = null;

		this.init();
	}

	private async init() {
		this.pause.Pause(null, GAME_START_MAX_WAIT);

		this.intervalID = setInterval(this.onTick, 1000 / GAME_TICKS_PER_SECOND);
	}

	private onTick() {
		if (this.ended) return ;

		if (this.pause.paused) return this.streamPause();

		this.updatePlayers();
		this.updateBall();
	}

	private updatePlayers() {
		for (let player of this.players)
			player.update();
	}

	private updateBall() {
		if (this.ball.y > GAME_CANVAS_HEIGHT - GAME_BORDER_SIZE ||
				this.ball.y - GAME_BORDER_SIZE < GAME_BORDER_SIZE)
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

			this.socket.emit('game::match::onCollide', { game: this, player: player });
		}

	}
	/*
		GETTERS
	*/

	public isPlayer(userId: number) {
		return this.players.find(p => p.id == userId) != null;
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
		this.socket.emit('game::match::onPause', this.pause);
	}

	private streamPaddleMove(user: User, move: GameMoves) {
		switch (move) {
			case GameMoves.MOVE_UP:
				this.socket.emit('game::match::onMove::up', { game: this, player: user });
			case GameMoves.MOVE_DOWN:
				this.socket.emit('game::match::onMove::down', { game: this, player: user });
			case GameMoves.MOVE_STOP:
				this.socket.emit('game::match::onMove::stop', { game: this, player: user });
		}
	}

	/*
		SPECTATOR
	*/

	public spectatorJoin(user: User) {
		this.socket.emit('game::spectator::onJoin', { game: this, spectator: user });
	}

	public spectatorLeave(user: User) {
		this.socket.emit('game::spectator::onLeave', { game: this, spectator: user });
	}

	public playerJoin(user: User) {
		this.socket.emit('game::match::onJoin', { game: this, player: user });

		if (this.players.find(p => p.id === user.id) !== null)
			return this.pause.resume();
		else if (this.players[0] == null)
			this.players[0] = new GamePlayer(user.id, user.login, 0);
		else if (this.players[1] == null)
			this.players[1] = new GamePlayer(user.id, user.login, 1);

		this.start();
	}

	private start() {
		if (this.players[1] === null)
			return ;

		this.pause.Pause(null, GAME_START_DELAY);
		this.ball.reset();

		this.socket.emit('game::match::onStart', { game: this });
	}

	/*
		SCORING
	*/

	private score(player: GamePlayer) {
		player.score++;
		if (player.score >= GAME_WIN_SCORE)
			return this.end();

		this.socket.emit('game::match::onScore', { game: this, player: player });
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

		this.socket.emit('game::match::onReset', { game: this });
	}

	private end() {
		clearInterval(this.intervalID);

		this.socket.emit('game::match::onEnd', { game: this });
		this.ended = true;
	}
};