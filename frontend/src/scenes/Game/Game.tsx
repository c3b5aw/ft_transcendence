import { Socket } from "socket.io-client";

import GamePlayer from './GamePlayer';
import GameBall from './GameBall';

import { GAME_CANVAS_HEIGHT, GAME_CANVAS_WIDTH,
	GAME_BORDER_SIZE, GAME_PLAYER_WIDTH, GAME_TICKS_PER_SECOND, getFactors } from './GameConstants';

export default class Game {
	public players: GamePlayer[] = [];

	public ball: GameBall = new GameBall();

	public ended: boolean = false;

	private intervalId: NodeJS.Timer;
	private socket: Socket;

	constructor(socket: Socket, matchData: any) {
		this.socket = socket;

		this.players[0] = new GamePlayer(matchData.player1, matchData.player1_login, 0, matchData.player1_score);
		this.players[1] = new GamePlayer(matchData.player2, matchData.player2_login, 1, matchData.player2_score);

		this.ended = matchData.finished;

		this.registerEvents();
		this.redraw();

		this.intervalId = setInterval(this.onTick.bind(this), 1000 / GAME_TICKS_PER_SECOND);
	}

	private registerEvents() {
		window.addEventListener('resize', this.redraw.bind(this));

		this.socket.on("game::match::onScore", this.onScore);
		this.socket.on("game::match::onStart", this.onStart);
		this.socket.on("game::match::onPause", this.onPause);
		this.socket.on("game::match::onReset", this.onReset);
		this.socket.on("game::match::onMove::up", this.onMoveUp);
		this.socket.on("game::match::onMove::down", this.onMoveDown);
		this.socket.on("game::match::onMove::stop", this.onMoveStop);
		this.socket.on("game::match::onCollide", this.onCollide);
		this.socket.on("game::match::onEnd", this.onEnd);
	}

	// EVENTS
	public onTick() {
		if (this.ended) 
			return ;

		this.updateBall();
		this.players.forEach(player => { player.update() });

		this.redraw();
	}

	// OBJECTS
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

	}

	// GAME EVENTS

	private onCollide() {}

	private onEnd() {
		this.ended = true;

		clearInterval(this.intervalId);
	}

	private onPause() {}

	private onReset() {}

	private onScore() {}

	private onStart() {}

	private onMoveUp() {}

	private onMoveDown() {}

	private onMoveStop() {}

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