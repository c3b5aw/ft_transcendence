import { GAME_BALL_START_X, GAME_BALL_START_Y, 
		GAME_BALL_RADIUS, getFactors, GAME_BALL_DEFAULT_SPEED } from './GameConstants';

export default class GameBall {
	public x: number = GAME_BALL_START_X;
	public y: number = GAME_BALL_START_Y;
	public radius: number = GAME_BALL_RADIUS;
	public speed: number = GAME_BALL_DEFAULT_SPEED;
	public direction: number = 0;

	public reset() {
		this.x = GAME_BALL_START_X;
		this.y = GAME_BALL_START_Y;

		this.speed = GAME_BALL_DEFAULT_SPEED;
	}

	public update(ball: { x: number, y: number, speed: number, direction: number } | null) {
		if (ball === null || ball === undefined)
			return ;

		this.x = ball.x;
		this.y = ball.y;
		this.speed = ball.speed;
		this.direction = ball.direction;
	}

	public draw(ctx: CanvasRenderingContext2D) {
		const { widthFactor, heightFactor } = getFactors(ctx);

		ctx.fillStyle = '#fff';

		ctx.arc(this.x * widthFactor,
				this.y * heightFactor,
				this.radius * widthFactor,
				0,
				Math.PI * 2);
		ctx.fill();

		ctx.stroke();
	}
}
