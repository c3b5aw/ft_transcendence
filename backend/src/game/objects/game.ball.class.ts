import { GAME_BALL_RADIUS, GAME_BALL_START_X, GAME_BALL_START_Y,
		GAME_BALL_SPEED_INCREASE, GAME_PLAYER_HEIGHT } from './game.constants';
import { GamePlayer } from './game.player.class';

export class GameBall {
	public x: number;
	public y: number;
	public radius: number;
	public speed: number;
	public direction: number;

	constructor() {
		this.reset();
		
		this.radius = GAME_BALL_RADIUS;

		this.speed = 0;
		this.direction = 0;
	}

	public reset() {
		this.x = GAME_BALL_START_X;
		this.y = GAME_BALL_START_Y;

		this.speed = 2;
		this.direction = Math.random() * 160 - 80;
	}

	public speedUp() {
		this.speed *= GAME_BALL_SPEED_INCREASE;
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
}