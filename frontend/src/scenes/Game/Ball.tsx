import { getCanvas } from './Launch'
import { Game } from './Game';
import { Paddle } from './Paddle';

const myaudiopong = require('./audio/pong.wav');
const myaudiovictory = require('./audio/applause7.wav');

export class	Ball {
	public y: number;
	public x: number;
	public r: number;
	private maxSpeed:number = 12;

	public speed: number;
	public direction: number;
	constructor(r:number, x:number, y:number) {
		this.y = y;
		this.x = x;
		this.r = r;
		this.speed = 2;

		this.direction = Math.random() * 160 - 80; //pour que la direction de depart differe
	}

	ballMove(game:Game) {
		// on fait en sorte que la balle rebondisse en haut et en bas
		if (this.y >= getCanvas().height - 20 || this.y <= 20)
			this.direction *= -1;

		// le rebond quand la balle touche un joueur
		if (this.x > getCanvas().width - game.player1.width - 20)
			this.collide(game.player2, game);
		else if (this.x < game.player1.width + 20)
			this.collide(game.player1, game);

		this.x += this.speed * Math.cos(this.direction * Math.PI / 180);
		this.y += this.speed * Math.sin(this.direction * Math.PI / 180);
	}

	collide(player:Paddle, game:Game) {
		if (this.y + this.r < player.y || this.y - this.r > player.y + player.height) {
			// is_play = false
			console.log("ball at ", this.y)
			console.log("player at ", player.y)
			//si le joueur ne tappe pas dans la balle on reinitialise les donnees 
			game.reset();
			if (player === game.player1) {
				game.playerScore2++;
				// document.querySelector('#computer-score')!.textContent = String(game.playerScore2);
			} else {
				game.playerScore1++;
				// document.querySelector('#player-score')!.textContent = String(game.playerScore1);
			}

			if (game.playerScore1 === 1) {
				var audio = new Audio(myaudiovictory);
				audio.play();
				game.print = 2;
			} else if (game.playerScore2 === 1) {
				game.print = 2;
			}

		} else {
			// si il la touche la vitesse augmente
			var audiovic = new Audio(myaudiopong);
			audiovic.play();
			this.changeDirection(player.y, player, game);
			if (Math.abs(this.speed) < this.maxSpeed && !game.on) {
				console.log("NORMAL");
				this.speed *= 1.2;
			} else if (Math.abs(this.speed) < this.maxSpeed && game.on && player === game.player2) {
				console.log("OFF SPEED");
				this.speed -= 1.8;
				this.speed *= 1.2;
			}
		}

		if (game.on && player === game.player2) {
			console.log("BOOST OFF");
			game.on = 0;
			game.space = false;
		}
	}

	changeDirection(playerPosition:number, player:Paddle, game:Game) {
		console.log("ball.y = ", this.y);
		console.log("Player .y = ", playerPosition);
		let impact: number = this.y - playerPosition - player.height / 2.0;
		if (impact < 0)
			impact += this.r;
		else
			impact -= this.r;

		const ratio = 100.0 / (player.height / 2.0);
		console.log("height  ", player.height);
		console.log("ratio ", ratio);

		//a une valeur entre -10 et 10 en fonction du point d impact
		const num: number = Math.round(impact * ratio / 10);
		if (player === game.player2)
			this.direction = 180 + num * 8;
		else
			this.direction = num * 8;

		console.log(" Ball touch at ", num, " got this direction " , this.direction);
	}

}

