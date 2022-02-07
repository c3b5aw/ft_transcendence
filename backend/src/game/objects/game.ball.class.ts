import { GAME_BALL_RADIUS, GAME_BALL_START_X, GAME_BALL_START_Y,
		GAME_BALL_DEFAULT_SPEED,
		GAME_BALL_SPEED_INCREASE, GAME_PLAYER_HEIGHT,
		GAME_BALL_MIN_ANGLE } from './game.constants';
import { GamePlayer } from './game.player.class';

function randomValue(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export class GameBall {
	public x: number = GAME_BALL_START_X;
	public y: number = GAME_BALL_START_Y;
	public radius: number = GAME_BALL_RADIUS;
	public speed: number = GAME_BALL_DEFAULT_SPEED;
	public direction: number = 0;

	private lastSpeedUp: Date = new Date(0);

	constructor() {
		this.reset();
	}

	public __repr__() {
		return {
			x: this.x, y: this.y,
			radius: this.radius,
			speed: this.speed, direction: this.direction
		}
	}

	public reset(player_slot: number = Math.random()) {
		this.x = GAME_BALL_START_X;
		this.y = GAME_BALL_START_Y;

		this.speed = GAME_BALL_DEFAULT_SPEED;

		const angle: number = randomValue(GAME_BALL_MIN_ANGLE, 180 - GAME_BALL_MIN_ANGLE);
		if (player_slot === 0)
			this.direction = angle;
		else
			this.direction = -angle;
	}

	public speedUp() {
		if (this.lastSpeedUp.getTime() + 1000 < new Date().getTime()) {
			this.lastSpeedUp = new Date();
			this.speed *= GAME_BALL_SPEED_INCREASE;
		}
	}

	public changeDirection(player: GamePlayer) {
		let impact: number = this.y - player.y - GAME_PLAYER_HEIGHT / 2;
		impact = impact < 0 ? impact + this.radius : impact - this.radius;

		const ratio: number = 100 / (GAME_PLAYER_HEIGHT / 2);
		const num: number = Math.round(impact * ratio / 10);
		if (player.slot === 0)
			this.direction = 90 + num * 8;
		else if (player.slot === 1)
			this.direction = -(90 + num * 8);
	}
}