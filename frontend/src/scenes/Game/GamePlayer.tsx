import { GameMoves } from './GameMoves';
import { GAME_PLAYER_START_Y, GAME_PLAYER_SPEED, GAME_BORDER_SIZE,
	GAME_PLAYER_HEIGHT, GAME_CANVAS_HEIGHT, GAME_CANVAS_WIDTH,
	GAME_PLAYER_WIDTH,
	getFactors } from './GameConstants';

export default class GamePlayer {
	public id: number;
	public login: string;
	public slot: number;
	public y: number = GAME_PLAYER_START_Y;
	public move: GameMoves = GameMoves.MOVE_STOP;

	public score: number;

	constructor(id: number, login: string, slot: number, score: number) {
		this.id = id;
		this.login = login;
		this.slot = slot;
		this.score = score;

		this.reset();

		this.updateScore(this.score);
		this.updateAvatar();
		this.updateLogin();
	}

	public load(arg: any) {
		this.id = arg.id;
		this.login = arg.login;
		this.y = arg.y;
		this.move = arg.move;
		this.score = arg.score;

		this.updateScore(this.score);
	}

	public reset() {
		this.y = GAME_PLAYER_START_Y;
	}

	public registerMove(move: GameMoves) {
		this.move = move;
	}

	private updateLogin() {
		let element: HTMLElement | null;
		if (this.slot === 0)
			element = document.getElementById('gamePlayerLeft');
		else if (this.slot === 1)
			element = document.getElementById('gamePlayerRight');

		element!.innerText = this.login;
	}

	public updateScore(score: number) {
		this.score = score;
		if (this.slot === 0)
			document.getElementById('gamePlayerScoreLeft')!.innerText = this.score.toString();
		else if (this.slot === 1)
			document.getElementById('gamePlayerScoreRight')!.innerText = this.score.toString();
	}

	private updateAvatar() {
		const avatar_url = `/api/users/${this.login}/avatar`;

		let element: HTMLElement | null;
		if (this.slot === 0)
			element = document.getElementById('gamePlayerAvatarLeft');
		else if (this.slot === 1)
			element = document.getElementById('gamePlayerAvatarRight');

		const image_elements = element!.getElementsByTagName('img');
		if (image_elements.length > 0)
			image_elements[0].src = avatar_url;
	}

	public update() {
		if (this.move === GameMoves.MOVE_UP)
			this.y -= GAME_PLAYER_SPEED;
		else if (this.move === GameMoves.MOVE_DOWN)
			this.y += GAME_PLAYER_SPEED;

		if (this.y <= GAME_BORDER_SIZE)
			this.y = GAME_BORDER_SIZE;

		if (this.y + GAME_PLAYER_HEIGHT >= GAME_CANVAS_HEIGHT - GAME_BORDER_SIZE)
			this.y = GAME_CANVAS_HEIGHT - GAME_BORDER_SIZE - GAME_PLAYER_HEIGHT;
	}

	public draw(ctx: CanvasRenderingContext2D) {
		const { widthFactor, heightFactor } = getFactors(ctx);

		const x = this.slot === 0 ? GAME_BORDER_SIZE : (GAME_CANVAS_WIDTH - GAME_PLAYER_WIDTH - GAME_BORDER_SIZE);
		ctx.fillStyle = '#fff';
		ctx.fillRect(x * widthFactor,
					this.y * heightFactor,
					GAME_PLAYER_WIDTH * widthFactor,
					GAME_PLAYER_HEIGHT * heightFactor);
	}
}