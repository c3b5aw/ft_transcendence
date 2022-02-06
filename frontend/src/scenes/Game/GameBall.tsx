import GamePlayer from './GamePlayer';
import { GAME_BALL_START_X, GAME_BALL_START_Y, 
		GAME_BALL_RADIUS, GAME_BALL_SPEED_INCREASE,
		GAME_PLAYER_HEIGHT,
		getFactors } from './GameConstants';

export default class GameBall {
	public x: number = GAME_BALL_START_X;
	public y: number = GAME_BALL_START_Y;
	public radius: number = GAME_BALL_RADIUS;
	public speed: number;
	public direction: number;

	constructor() {
		this.reset();

		this.speed = 0;
		this.direction = 0;

		this.reset();
	}

	public reset() {
		this.x = GAME_BALL_START_X;
		this.y = GAME_BALL_START_Y;

		this.speed = 2;
	}

	public speedUp() {
		this.speed *= GAME_BALL_SPEED_INCREASE;
	}

	public update(ball: { x: number, y: number, speed: number, direction: number } | null) {
		if (ball === null)
			return ;

		this.x = ball.x;
		this.y = ball.y;
		this.speed = ball.speed;
		this.direction = ball.direction;
	}

	public changeDirection(player: GamePlayer) {
		let impact: number = this.y - player.y - GAME_PLAYER_HEIGHT / 2;
		impact = impact < 0 ? impact + this.radius : impact - this.radius;

		const ratio: number = 100 / (GAME_PLAYER_HEIGHT / 2);
		const num: number = Math.round(impact * ratio / 10);
		if (player.slot === 1)
			this.direction = num * 8;
		else
			this.direction = 180 + num * 8;
	}

	public draw(ctx: CanvasRenderingContext2D) {
		const { widthFactor, heightFactor } = getFactors(ctx);

		ctx.fillStyle = '#fff';

		ctx.arc(this.x * widthFactor, this.y * heightFactor, this.radius, 0, Math.PI * 2);
		ctx.fill();

		ctx.stroke();
	}
}
