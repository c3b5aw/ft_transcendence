import { Socket } from "socket.io-client";

import GamePlayer from './GamePlayer';
import GamePause from './GamePause';
import GameBall from './GameBall';

import { GAME_CANVAS_HEIGHT, GAME_CANVAS_WIDTH,
	GAME_BORDER_SIZE, GAME_PLAYER_WIDTH, GAME_TICKS_PER_SECOND, getFactors, GAME_PLAYER_HEIGHT, GAME_BALL_MAX_SPEED } from './GameConstants';
import { GameMoves } from "./GameMoves";

export default class Game {
	private players: GamePlayer[] = [];
	private ball: GameBall = new GameBall();

	private pause: GamePause = new GamePause();
	private myself: any = null;

	private hash: string = "";
	public ended: boolean = false;
	private joined: boolean = false;

	private intervalId: NodeJS.Timer | null = null;
	private socket: Socket | null = null;

	constructor(socket: Socket | null, matchData: any, myself: any) {
		if (socket === null)
			return ;

		this.socket = socket;
		this.myself = myself;
		this.hash = matchData.hash;

		this.players[0] = new GamePlayer(matchData.player1, matchData.player1_login, 0, matchData.player1_score);
		this.players[1] = new GamePlayer(matchData.player2, matchData.player2_login, 1, matchData.player2_score);

		this.ended = matchData.finished;

		this.registerEvents();
		this.redraw();
	}

	private registerEvents() {
		window.addEventListener('resize', this.redraw.bind(this));

		if (this.socket === null)
			return ;

		this.socket.on('game::match::onBoard', (arg) => { this.onBoard(arg) });
		this.socket.on('game::match::onJoin', (arg) => { this.onJoin(arg) });
		this.socket.on('game::match::onScore', (arg) => { this.onScore(arg) });
		this.socket.on('game::match::onStart', (arg) => { this.onStart(arg) });
		this.socket.on('game::match::onPause', (arg) => { this.onPause(arg) });
		this.socket.on('game::match::onReset', (arg) => { this.onReset(arg) });
		this.socket.on('game::match::onMove::up', (arg) => { this.onMoveUp(arg) });
		this.socket.on('game::match::onMove::down', (arg) => { this.onMoveDown(arg) });
		this.socket.on('game::match::onMove::stop', (arg) => { this.onMoveStop(arg) });
		this.socket.on('game::match::onCollide', (arg) => { this.onCollide(arg) });
		this.socket.on('game::match::onEnd', (arg) => { this.onEnd() });

		const player: GamePlayer | undefined = this.players.find(
					player => player.id === this.myself.id);
		if (player !== undefined) {
			window.addEventListener('keyup', this.onKeyUp.bind(this));
			window.addEventListener('keydown', this.onKeyDown.bind(this));
		}

		if (!this.joined)
			this.socket.emit('game::join', JSON.stringify({ hash: this.hash }));
	}

	// EVENTS
	private onKeyDown(event: KeyboardEvent) {
		if (this.ended || this.socket === null || this.pause.paused)
			return ;

		switch (event.key) {
			case "ArrowUp":
			case "w":
				this.socket.emit('game::paddle::move::up');
				break;

			case "ArrowDown":
			case "s":
				this.socket.emit('game::paddle::move::down');
				break;
		}
	}

	private onKeyUp(event: KeyboardEvent) {
		if (this.ended || this.socket === null || this.pause.paused)
			return ;

		const player: GamePlayer | undefined = this.players.find(
					player => this.myself.id === player.id);
		if (player === undefined) return;
	
		switch (event.key) {
			case "ArrowUp":
			case "w":
				if (player.move === GameMoves.MOVE_UP)
					this.socket.emit('game::paddle::move::stop');
				break;

			case "ArrowDown":
			case "s":
				if (player.move === GameMoves.MOVE_DOWN)
					this.socket.emit('game::paddle::move::stop');
				break;
		}
	}

	public onTick() {
		if (this.ended) return ;

		if (!this.pause.paused) {
			this.updateBall();
			this.players.forEach(player => { player.update() });
		}

		this.redraw();
	}

	// OBJECTS
	private updateBall() {
		if (this.ball.y >= GAME_CANVAS_HEIGHT - GAME_BORDER_SIZE || this.ball.y <= GAME_BORDER_SIZE)
			this.ball.direction = -this.ball.direction;

		// if (this.ball.x > GAME_CANVAS_WIDTH - GAME_PLAYER_WIDTH - GAME_BORDER_SIZE)
		// 	this.collidePlayer(this.players[1]);
		// else if (this.ball.x < GAME_PLAYER_WIDTH + GAME_BORDER_SIZE)
		// 	this.collidePlayer(this.players[0]);

		this.ball.x += this.ball.speed * Math.cos(this.ball.direction * Math.PI / 180);
		this.ball.y += this.ball.speed * Math.sin(this.ball.direction * Math.PI / 180);
	}

	private collidePlayer(player: GamePlayer) {
		if (this.ball.y + this.ball.radius < player.y || this.ball.y - this.ball.radius > player.y + GAME_PLAYER_HEIGHT) {
			return ;
		} else {
			this.ball.changeDirection(player);
			if (Math.abs(this.ball.speed) < GAME_BALL_MAX_SPEED)
				this.ball.speedUp();
		}

	}

	// GAME EVENTS
	private onBoard(arg: any) {
		try {
			const { ball, players, pause } = arg.game;

			this.ball.update(ball);
			this.pause.update(pause);

			players.forEach((player: any) => {
				if (this.players[player.slot].id === player.id)
					this.players[player.slot].load(player);
			});
		} catch (e) {
			console.log(`Unable to load board: ${e}`);
			return ;
		}

		this.intervalId = setInterval(this.onTick.bind(this), 1000 / GAME_TICKS_PER_SECOND);
	}

	private onJoin(arg: any) {
		this.joined = true;

		const player: GamePlayer | undefined = this.players.find(
					player => player.id === arg.id);

		if (player === undefined) return;

		player.login = arg.login;
		player.score = arg.score;
	}

	private onCollide(arg: any) {
		try {
			const { ball } = arg;
			this.ball.update(ball);
		} catch (e) {
			console.log(`unpack: on_collide: error: ${e}`);
		}
	}

	private onEnd() {
		this.pause.paused = false;
		this.ended = true;

		if (this.intervalId !== null)
			clearInterval(this.intervalId);

		this.redraw();
	}

	private onPause(arg: any) { this.pause.update(arg) }

	private onReset(arg: any) {
		try {
			const { ball } = arg;

			this.ball.reset();
			this.ball.direction = ball.direction;
		} catch (e) {
			console.log(`unpack: on_reset: error: ${e}`)
		}
	}

	private onScore(arg: any) {
		try {
			const { player } = arg;

			this.ball.reset();

			this.players[player.slot].updateScore(player.score);
		} catch (e) {
			console.log(`unpack: on_score: error: ${e}`);
		}
	}

	private onStart(arg: any) {
		try {
			const { ball, pause } = arg.game;

			this.ball.reset();
			this.ball.direction = ball.direction;

			this.pause.update(pause);
		} catch (e) {
			console.log(`unpack: on_start: error: ${e}`);
		}
	}

	private onMove(arg: any, move: GameMoves) {
		if (this.ended) return ;

		this.players.find(player => player.id === arg.id)!.move = move;
	}

	private onMoveUp(arg: any) {
		return this.onMove(arg, GameMoves.MOVE_UP)
	}

	private onMoveDown(arg: any) {
		return this.onMove(arg, GameMoves.MOVE_DOWN)
	}

	private onMoveStop(arg: any) {
		return this.onMove(arg, GameMoves.MOVE_STOP)
	}

	// DRAWER

	public redraw() {
		const canvas: HTMLCanvasElement | null = document.getElementById('game-canvas') as HTMLCanvasElement;
		if (!canvas) return ;

		const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
		if (!ctx) return ;

		ctx.canvas.height = canvas.getBoundingClientRect().height;
		ctx.canvas.width = canvas.getBoundingClientRect().width;

		// CLEAR CANVAS
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		if (this.pause.paused)
			return this.pause.draw(ctx);

		// DRAW EACH ENTITY
		if (!this.ended) {
			this.ball.draw(ctx);
			this.players.forEach(player => { player.draw(ctx) });
			this.drawBorders(ctx);
		}

		// DRAW END SCREEN
		if (this.ended)
			this.drawEnd(ctx);
	}

	private drawBorders(ctx: CanvasRenderingContext2D) {
		// SIDE BORDERS
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 1;
		ctx.strokeRect(GAME_BORDER_SIZE, GAME_BORDER_SIZE,
						ctx.canvas.width - (GAME_BORDER_SIZE * 2),
						ctx.canvas.height - (GAME_BORDER_SIZE * 2));

		// MIDDLE BORDER
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#fff';
		ctx.moveTo(ctx.canvas.width / 2, 0 + GAME_BORDER_SIZE);
		ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height - GAME_BORDER_SIZE);
		ctx.stroke()
	}

	private drawEnd(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = '#fff';

		const { widthFactor } = getFactors(ctx);

		ctx.font = `${Math.floor(48 * widthFactor)}px monospace`;
		ctx.textAlign = 'center';

		ctx.fillText('Game is Over', ctx.canvas.width / 2, ctx.canvas.height / 2);
	}
}