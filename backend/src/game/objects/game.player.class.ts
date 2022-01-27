import { GAME_PLAYER_START_Y, GAME_PLAYER_SPEED, GAME_BORDER_SIZE,
		GAME_PLAYER_HEIGHT, GAME_CANVAS_HEIGHT } from './game.constants';
import { GameMoves } from './moves.enums';

export class GamePlayer {
	public id: number;
	public login: string;
	public slot: number;

	public y: number;

	public move: GameMoves;

	public score: number;

	constructor(id: number, login: string, slot: number) {
		this.score = 0;
		this.reset();
	}

	public reset() {
		this.y = GAME_PLAYER_START_Y;
	}

	public registerMove(move: GameMoves) {
		this.move = move;
	}

	public update() {
		if (this.move == GameMoves.MOVE_UP)
			this.y -= GAME_PLAYER_SPEED;
		else if (this.move == GameMoves.MOVE_DOWN)
			this.y += GAME_PLAYER_SPEED;

		if (this.y < GAME_BORDER_SIZE)
			this.y = GAME_BORDER_SIZE;

		if (this.y + GAME_PLAYER_HEIGHT > GAME_CANVAS_HEIGHT - GAME_BORDER_SIZE)
			this.y = GAME_CANVAS_HEIGHT - GAME_BORDER_SIZE - GAME_PLAYER_HEIGHT;
	}
}