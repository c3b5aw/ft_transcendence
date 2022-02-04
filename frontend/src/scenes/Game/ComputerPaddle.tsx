import { Ball } from './Ball';
import { getCanvas } from './Launch'

export class	computerPaddle {
	public width: number;
	public height: number;
	public y: number;
	public x: number;

	constructor(width:number, height:number, y:number, x:number) {
		this.width = width;
		this.height = height;
		this.y = y;
		this.x = x;
	}

	computerMove = (ball:Ball) => { // suis la balle a un peu moins que la vitesse de la balle
		let i: number = 1;
		this.y += ball.speed * Math.sin(ball.direction * Math.PI / 180) * i; //* 0.85;
		if (this.y <= 20)
			this.y = 20;
		if (this.y + this.height >= getCanvas().height - 20)
			this.y = getCanvas().height - 20 - this.height;
	}
}
