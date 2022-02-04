import { useEffect, useRef } from 'react';
import { Paper, Grid } from "@mui/material";

import GameCanvas from './GameCanvas';
import GameButtons from './GameButtons';
import GameScoreBoard from './GameScoreBoard';
import GameModifiers from './GameModifiers';

import { RandomBG } from './GameUtils';

// const PLAYER_HEIGHT = 100.0;
// const PLAYER_WIDTH = 5;
// const MAX_SPEED = 12;

class	Game {
	// public	canvas;
	private context: any;
	private anim: any;
	public playerScore1: number = 0;
	public playerScore2: number = 0;
	public print: number = 0;
	public on: number = 0;
	public random: boolean = false;
	public boost: boolean = false;
	public is_play: boolean = false;
	public space: boolean = false;
	public player1!: Paddle;
	public player2!: Paddle;
	// public player2!: computerPaddle;
	private ball!: Ball;

	constructor() {
		console.log("constructor GAME");
		// this.canvas = document.getElementById('game-Canvas'); 
		if (!getCanvas()) {
			console.log("empty canva");
			return ;
		}
		console.log(getCanvas().clientWidth, getCanvas().clientHeight,  "W & H constr");
		this.context  = getCanvas().getContext("2d");
		if (!this.context) {
			console.log("empty context");
			return ;
		}
		var paddleWidth:number = 5, paddleHeight:number = 100, ballRadius:number = 5, wall:number = 20;
		this.player1 = new Paddle(paddleWidth, paddleHeight, wall, getCanvas().height / 2 - paddleHeight / 2);
		this.player2 = new Paddle(paddleWidth, paddleHeight, getCanvas().width - (wall + paddleWidth), getCanvas().height / 2 - paddleHeight / 2);
		// this.player2 = new computerPaddle(paddleWidth, paddleHeight, getCanvas().width - (wall + paddleWidth), getCanvas().height / 2 - paddleHeight / 2);
		this.ball = new Ball(ballRadius, getCanvas().width / 2 - ballRadius, getCanvas().height / 2 - ballRadius);
		window.addEventListener('resize', this.resize); 		
		this.checkWindow();
		this.reset();
		console.log("constructor GAME out");
	}

	resize = () => {
		// pause();
		this.checkWindow();
	}

	draw() {
		if (!getCanvas() || !this.context)
			return ;
		// var context = canvas.getContext('2d');

		//CanvasRenderingContext2D
		//https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D
		console.log("position", this.player1.y);
		//table
		if (this.random === false) {
			this.context.fillStyle = 'black';
			this.context.fillRect(0, 0, getCanvas().width,  getCanvas().height); //dessine des rectangles
		} else {
			this.context.clearRect(0, 0, getCanvas().width, getCanvas().height);
		}
		if (this.print === 0) {
			this.context.lineWidth = 2;
			this.context.strokeRect(10, 10, getCanvas().width - 20, getCanvas().height - 20); //dessine les contours d un rectangle (rectangle interieur) du pong

			this.context.strokeStyle = 'white';
			this.context.beginPath();
			this.context.moveTo(getCanvas().width / 2, 0 + 10); //depart de la ligne
			this.context.lineTo(getCanvas().width / 2, getCanvas().height - 10); //longueur de la ligne
			this.context.stroke(); //trace

			//player
			this.context.fillStyle = 'white';
			this.context.fillRect(20, this.player1.y, this.player1.width , this.player1.height);
			this.context.fillRect(getCanvas().width - this.player1.width - 20, this.player2.y, this.player1.width, this.player1.height);

			//ball
			this.context.beginPath();
			if (this.on === 0) 
				this.context.fillStyle = 'white';
			else 
				this.context.fillStyle = 'red';
			this.context.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI * 2, false); // permet de tracet un cercle
			this.context.fill(); //rempli le chemin courant avec la derniere couleur donnee
		} else if (this.print === 1) {
			// context.fillStyle = 'white';
			// context.font = '48px serif';
			// context.fillText("Error : window's too small", 20 , canvas.height / 2);
		} else if (this.print === 2) {
			this.context.fillStyle = 'white';
			this.context.font = 'bold 100px verdana, sans-serif';
			// console.log(game.player.score, "vs", game.computer.score )
			if (this.playerScore1 > this.playerScore2) {
				this.stopGame();
				this.context.fillText("VICTORY !", getCanvas().width / 2 - 200, getCanvas().height / 2);
			} else {
				this.stopGame();
				this.context.fillStyle = 'red';
				this.context.fillText("DEFEAT !", getCanvas().width / 2 - 200, getCanvas().height / 2);
			}
		}
	}

	game_loop() {
		if (this.is_play === false)
			return;
		this.draw();

		// this.player2.computerMove(this.ball);
		this.ball.ballMove(this);
		this.anim = requestAnimationFrame(this.game_loop.bind(this)); //appelle 60 fois par secondes
	}

	play() {
		if (this.is_play === false && this.print === 0) {
			this.is_play = true;
			console.log(this.is_play);
			this.anim = requestAnimationFrame(this.game_loop.bind(this)); //appelle 60 fois par secondes
		} else if (this.print !== 0) {
			this.draw();
		}
	}

	pause() {
		this.is_play = false;
		cancelAnimationFrame(this.anim);
		this.anim = null;
		// draw();
	}

	stopGame() {
		this.is_play = false;
		cancelAnimationFrame(this.anim);
		this.anim = null;
		this.reset();
		this.playerScore1 = 0;
		this.playerScore2 = 0;
		// document.querySelector('#computer-score')!.textContent = String(this.playerScore2);
		// document.querySelector('#player-score')!.textContent = String(this.playerScore1);
		this.draw();
	}

	checkWindow() {
		const width  = window.innerWidth || document.documentElement.clientWidth ||
			document.body.clientWidth;
		const height = window.innerHeight|| document.documentElement.clientHeight||
			document.body.clientHeight;
		console.log(width, height, "WIDTH & HEIGHT");
		// if (width < 1000 || height < 1100) {
		// console.log(width, height, "ERROR");
		// print = 1;
		// } else
		if (this.print === 1) {
			console.log(width, height, "NO ERROR");
			this.print = 0;
		}
		this.setUpCanvas(width);
	}

	setUpCanvas = (width: number) => {
		// Feed the size back to the canvas.
		if (!getCanvas())
			return ;
		const oldWidth = getCanvas().width;
		const oldHeight = getCanvas().height;
		console.log(getCanvas().width, getCanvas().height, this.ball.x, this.ball.y, this.player1.y, this.player2.y,  "SET UP CANVAS FROM bef");
		getCanvas().width = (width * 1000) / 1100; 
		getCanvas().height = (width * 600) / 1100;
		console.log(getCanvas().width, getCanvas().height, this.ball.x, this.ball.y, this.player1.y, this.player2.y,  "SET UP CANVAS FROM mid");
		if (getCanvas().width > 1400) {
			getCanvas().width = 1400;
		}
		if (getCanvas().height > 800) {
			getCanvas().height = 800;
		}
		//mise a jour des positions des joueurs et de la balle
		this.ball.x = (this.ball.x * getCanvas().width) / oldWidth;
		this.ball.y = (this.ball.y * getCanvas().height) / oldHeight;
		this.player1.y = (this.player1.y * getCanvas().height) / oldHeight;
		this.player2.y = (this.player2.y * getCanvas().height) / oldHeight;
		console.log(getCanvas().width, getCanvas().height, this.ball.x, this.ball.y, this.player1.y, this.player2.y,  "SET UP CANVAS FROM ");
	}

	reset() {
		this.ball.x = getCanvas().width / 2;
		this.ball.y = getCanvas().height / 2;
		this.player1.y = getCanvas().height / 2 - this.player1.height / 2;
		this.player2.y = getCanvas().height / 2 - this.player1.height / 2;

		this.on = 0;
		this.print = 0;
		this.ball.speed = 2;
		this.ball.direction = Math.random() * 160 - 80; //pour que la direction de depart differe
	}
}

function	getCanvas() {
	const canvas : any =  document.getElementById('game-Canvas');
	return canvas;
}

class	Paddle {
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
		// console.log("MOVEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
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

		if (this.y < 20)
			this.y = 20;
		if (this.y + this.height > getCanvas().height - 20)
			this.y = getCanvas().height - 20 - this.height;
		// document.getElementById('player1')!.style.top = this.y + 'px';
	}
}

class	Ball {
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
		if (this.y > getCanvas().height - 20 || this.y - 20 < 20)
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

			if (game.playerScore1 === 1 || game.playerScore2 === 1)
				game.print = 2;

		} else {
			// si il la touche la vitesse augmente
			this.changeDirection(player.y, player, game);
			if (Math.abs(this.speed) < this.maxSpeed && !game.on) {
				console.log("NORMAL");
				this.speed *= 1;
			} else if (Math.abs(this.speed) < this.maxSpeed && game.on && player === game.player2) {
				console.log("OFF SPEED");
				this.speed -= 1.8;
				this.speed *= 1;
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

// class	computerPaddle {
// 	public width: number;
// 	public height: number;
// 	public y: number;
// 	public x: number;

// 	constructor(width:number, height:number, y:number, x:number) {
// 		// super(width, height, y, x);
// 		this.width = width;
// 		this.height = height;
// 		this.y = y;
// 		this.x = x;
// 	}

export default function	Launch() {
	// document.addEventListener('DOMContentLoaded', function() {
	const gameRef = useRef<Game | null>(null);

	useEffect(() => {
		gameRef.current = new Game();
	},[]);

	const	handleBoost = () => { gameRef.current!.boost = !gameRef.current!.boost; }

	const	handleBackground = () => {
		gameRef.current!.random = !gameRef.current!.random;
		getCanvas().style.background = gameRef.current!.random ? RandomBG() : 'black';
	}

	const startGame = () => {
		// .... -> useRef.current!. -> ...
		console.log(gameRef.current);
		gameRef.current!.play();
	}

	const stopGame = () => {
		// .... -> useRef.current!. -> ...
		gameRef.current!.stopGame();
	}

	const pauseGame = () => {
		// .... -> useRef.current!. -> ...
		gameRef.current!.pause();
	}

	return (
		<Grid container
		direction="column" alignItems="center" justifyContent="center"
		style={{ minHeight: '100vh' }}
	>
		<Grid item xs={3}>
		<Paper elevation={ 4 }
		sx={{ borderRadius: '0px' }}
	>
		<GameScoreBoard />
		<GameModifiers boostCallback={ handleBoost } backgroundCallback={ handleBackground } />
		<GameButtons startGame={ startGame } stopGame= { stopGame } pauseGame={ pauseGame } />
		<GameCanvas />
		</Paper>
		</Grid>
		</Grid>
	);
}
