import { Socket } from "socket.io-client";

import GamePlayer from './GamePlayer';
import GamePause from './GamePause';
import GameBall from './GameBall';

import { GAME_BORDER_SIZE, GAME_TICKS_PER_SECOND, getFactors } from './GameConstants';
import { GameMoves } from "./GameMoves";

export default class Game {
	public players: GamePlayer[] = [];
	private ball: GameBall = new GameBall();

	private pause: GamePause = new GamePause();
	private myself: any = null;

	private hash: string = "";
	private joined: boolean = false;
	public handleFinished: any = null;

	public ended: boolean = false;

	private intervalId: NodeJS.Timer | null = null;
	private socket: Socket | null = null;

	private lastMove: GameMoves = GameMoves.MOVE_STOP;

	private playCollideSound: Function;

	constructor(socket: Socket | null, matchData: any, myself: any, handleFinished: any, playCollideSound: Function) {
		this.playCollideSound = playCollideSound;
		
		if (socket === null)
			return ;

		this.socket = socket;
		this.myself = myself;
		this.hash = matchData.hash;
		this.handleFinished = handleFinished;

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
		this.socket.on('game::match::onEnd', (arg) => { this.onEnd(arg) });

		const player: GamePlayer | undefined = this.players.find(
					player => player.id === this.myself.id);
		if (player !== undefined) {
			player.myself = true;
			window.addEventListener('keyup', this.onKeyUp.bind(this));
			window.addEventListener('keydown', this.onKeyDown.bind(this));
		}

		if (!this.joined)
			this.socket.emit('game::join', JSON.stringify({ hash: this.hash }));
	}

	// EVENTS
	public onSurrender() {
		if (this.socket === null)
			return ;
		this.socket.emit('game::surrender');
	}

	private onKeyDown(event: KeyboardEvent) {
		if (this.ended || this.socket === null || this.pause.paused)
			return ;

		switch (event.key) {
			case "ArrowUp":
			case "w":
				if (this.lastMove !== GameMoves.MOVE_UP) {
					this.socket.emit('game::paddle::move::up');
					this.lastMove = GameMoves.MOVE_UP;
				}
				break;

			case "ArrowDown":
			case "s":
				if (this.lastMove !== GameMoves.MOVE_DOWN) {
					this.socket.emit('game::paddle::move::down');
					this.lastMove = GameMoves.MOVE_DOWN;
				}
				break;
		}
	}

	private onKeyUp(event: KeyboardEvent) {
		if (this.ended || this.socket === null || this.pause.paused)
			return ;
		
		if (this.lastMove === GameMoves.MOVE_STOP)
			return ;

		const player: GamePlayer | undefined = this.players.find(
					player => this.myself.id === player.id);
		if (player === undefined) return;
	
		switch (event.key) {
			case "ArrowUp":
			case "w":
				if (player.move === GameMoves.MOVE_UP)
					this.socket.emit('game::paddle::move::stop');
				this.lastMove = GameMoves.MOVE_STOP;
				break;

			case "ArrowDown":
			case "s":
				if (player.move === GameMoves.MOVE_DOWN)
					this.socket.emit('game::paddle::move::stop');
				this.lastMove = GameMoves.MOVE_STOP;
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
		this.ball.x += this.ball.speed * Math.sin(this.ball.direction * Math.PI / 180);
		this.ball.y -= this.ball.speed * Math.cos(this.ball.direction * Math.PI / 180);
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

		if (this.intervalId === null)
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
			const { ball, obstacle } = arg;
			this.ball.update(ball);

			if (obstacle === 'player')
				this.playCollideSound();
		} catch (e) {
			console.log(`unpack: on_collide: error: ${e}`);
		}
	}

	private onEnd(arg: any) {
		this.pause.paused = false;
		this.ended = true;

		if (this.intervalId !== null)
			clearInterval(this.intervalId);

		this.redraw();
		this.handleFinished(this.players, arg);
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
			this.players.forEach(p => {
				this.players[p.slot].reset();
			});

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

		this.players[arg.slot].move = move;
		this.players[arg.slot].y = arg.y;
	}

	private onMoveUp(arg: any) {
		return this.onMove(arg, GameMoves.MOVE_UP);
	}

	private onMoveDown(arg: any) {
		return this.onMove(arg, GameMoves.MOVE_DOWN);
	}

	private onMoveStop(arg: any) {
		return this.onMove(arg, GameMoves.MOVE_STOP);
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
		const { widthFactor, heightFactor } = getFactors(ctx);

		// SIDE BORDERS
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 1;
		ctx.strokeRect(GAME_BORDER_SIZE * widthFactor, GAME_BORDER_SIZE * heightFactor,
						ctx.canvas.width - ((GAME_BORDER_SIZE * widthFactor) * 2),
						ctx.canvas.height - ((GAME_BORDER_SIZE * heightFactor) * 2));

		// MIDDLE BORDER
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#fff';
		ctx.moveTo(ctx.canvas.width / 2, GAME_BORDER_SIZE * heightFactor);
		ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height - (GAME_BORDER_SIZE * heightFactor));
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