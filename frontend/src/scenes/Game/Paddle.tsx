import { getCanvas } from './Launch'

export class	Paddle {
	public width: number;
	public height: number;
	public y: number;
	public x: number;
	public up: boolean = false;
	public down: boolean = false;
	public space: boolean = false;

	constructor(width:number, height:number, x:number, y:number) {
		document.addEventListener("keydown", this.keyDown.bind(this)); 
		document.addEventListener("keyup", this.keyUp.bind(this));
		this.width = width;
		this.height = height;
		this.y = y;
		this.x = x;
		setInterval(this.movements.bind(this), 1000 / 60);
	}

	keyUp(event:any){
		switch (event.key) {
			case "ArrowUp":
			case "w":
				this.up = false;
				break
			case "ArrowDown":
			case "s":
				this.down = false;
				break
		}
	}

	keyDown(event:any) {
		switch (event.key) {
			case "ArrowUp":
			case "w":
				this.up = true;
				break
			case "ArrowDown":
			case "s":
				this.down = true;
				break
			case " ":
			case "Shift":
				this.space = true;
				break
		}
	}

	movements = () => { // execution every delay milliseconds
		const move:number = 10;
		if (this.up && !this.down) {
			console.log("up");
			this.y -= move;
		console.log("MOVE - ", this.y);
		} else if (this.down && !this.up) {
			console.log("down");
			this.y += move;
		console.log("MOVE - ", this.y);
		}
		// if (Game.space && boost === true && (game.ball.x < 20 + PLAYER_WIDTH + 10)
		// 	&& game.ball.y > game.player.y && game.ball.y < game.player.y + PLAYER_HEIGHT)  { 
		// 	console.log("BOOST ON");
		// 	game.ball.speed += 1;
		// 	on = 1;
		// }

		if (this.y < 10)
			this.y = 10;
		if (this.y + this.height > getCanvas().height - 10)
			this.y = getCanvas().height - 10 - this.height;
		// document.getElementById('player1')!.style.top = this.y + 'px';
	}
}

