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
	private ball!: Ball;

	constructor() {
		console.log("constructor GAME");
		// this.canvas = document.getElementById('game-Canvas'); 
		if (!getCanvas()) {
			console.log("empty canva");
			return ;
		}
		this.context  = getCanvas().getContext("2d");
		if (!this.context) {
			console.log("empty context");
			return ;
		}
		// console.log(this.is_play);
		console.log("constructor GAME");
		window.addEventListener('resize', this.resize); 		
		this.checkWindow();
		var paddleWidth:number = 5, paddleHeight:number = 100, ballRadius:number = 5, wall:number = 20;
		this.player1 = new Paddle(paddleWidth, paddleHeight, wall, getCanvas().height / 2 - paddleHeight / 2);
		this.player2 = new Paddle(paddleWidth, paddleHeight, getCanvas().width - (wall + paddleWidth), getCanvas().height / 2 - paddleHeight / 2);
		this.ball = new Ball(ballRadius, getCanvas().width / 2 - ballRadius, getCanvas().height / 2 - ballRadius);
	}

	resize() {
			// pause();
		this.checkWindow();
	}

	draw() {
		if (!getCanvas() || !this.context)
			return ;
		// var context = canvas.getContext('2d');

		//CanvasRenderingContext2D
		//https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D

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

	play() {
		if (this.is_play === false && this.print === 0) {
			this.is_play = true;
			this.anim = requestAnimationFrame(this.game_loop); //appelle 60 fois par secondes
		} else if (this.print !== 0) {
			this.draw();
		}
	}

	game_loop() {
		if (!this.is_play)
			return;
		this.draw();

		//computerMove();
		this.ball.ballMove(this);
		this.anim = requestAnimationFrame(this.game_loop); //appelle 60 fois par secondes
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
		// reset();
		this.playerScore1 = 0;
		this.playerScore2 = 0;
		document.querySelector('#computer-score')!.textContent = String(this.playerScore2);
		document.querySelector('#player-score')!.textContent = String(this.playerScore1);
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

	setUpCanvas(width: number) {
		// Feed the size back to the canvas.
		if (!getCanvas())
			return ;
		const oldWidth = getCanvas().width;
		const oldHeight = getCanvas().height;
		getCanvas().width = (width * 1000) / 1100; 
		getCanvas().height = (width * 600) / 1100;
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


}

//export default function Game() {
//	var canvas: any;
//	var game: any;
//	var anim: any;
//	var on: number = 0;
//	var print: number = 0;
//	var boost: boolean, random: boolean = false;
//	var up: boolean, down: boolean, space: boolean = false;
//	var is_play: boolean = false;

//	const draw = () => {
//		var context = canvas.getContext('2d');

//		//CanvasRenderingContext2D
//		//https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D

//		//table
//		if (random === false) {
//			context.fillStyle = 'black';
//			context.fillRect(0, 0, canvas.width, canvas.height); //dessine des rectangles
//		} else {
//			context.clearRect(0, 0, canvas.width, canvas.height);
//		}
//		if (print === 0) {
//		context.lineWidth = 2;
//		context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20); //dessine les contours d un rectangle (rectangle interieur) du pong

//		context.strokeStyle = 'white';
//		context.beginPath();
//		context.moveTo(canvas.width / 2, 0 + 10); //depart de la ligne
//		context.lineTo(canvas.width / 2, canvas.height - 10); //longueur de la ligne
//		context.stroke(); //trace

//		//player
//		context.fillStyle = 'white';
//		context.fillRect(20, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
//		context.fillRect(canvas.width - PLAYER_WIDTH - 20, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);

//		//ball
//		context.beginPath();
//		if (on === 0) 
//			context.fillStyle = 'white';
//		else 
//			context.fillStyle = 'red';
//		context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false); // permet de tracet un cercle
//		context.fill(); //rempli le chemin courant avec la derniere couleur donnee
//		} else if (print === 1) {
//			// context.fillStyle = 'white';
//			// context.font = '48px serif';
//			// context.fillText("Error : window's too small", 20 , canvas.height / 2);
//		} else if (print === 2) {
//			context.fillStyle = 'white';
//			context.font = 'bold 100px verdana, sans-serif';
//			// console.log(game.player.score, "vs", game.computer.score )
//			if (game.player.score > game.computer.score) {
//				stopGame();
//				context.fillText("VICTORY !", canvas.width / 2 - 200, canvas.height / 2);
//			} else {
//				stopGame();
//				context.fillStyle = 'red';
//				context.fillText("DEFEAT !", canvas.width / 2 - 200, canvas.height / 2);
//			}
//		}
//	}

// const play = () => {
// 	if (!is_play && print === 0) {
// 		is_play = true;
// 		anim = requestAnimationFrame(game_loop); //appelle 60 fois par secondes
// 	} else if (print !== 0) {
// 		draw();
// 	}
// }

// const game_loop = () => {
// 	if (!is_play)
// 		return;
// 	draw();

// 	computerMove();
// 	ballMove();
// 	anim = requestAnimationFrame(game_loop); //appelle 60 fois par secondes
// }

// const pause = () => {
// 	is_play = false;
// 	cancelAnimationFrame(anim);
// 	anim = null;
// 	// draw();
// }

// const stopGame = () => {
// 	is_play = false;
// 	cancelAnimationFrame(anim);
// 	anim = null;
// 	reset();
// 	game.computer.score = 0;
// 	game.player.score = 0;
// 	document.querySelector('#computer-score')!.textContent = game.computer.score;
// 	document.querySelector('#player-score')!.textContent = game.computer.score;
// 	draw();
// }

function	getCanvas() {
	const canvas : any =  document.getElementById('game-Canvas');
	// static const context = canvas.getContext('2d');
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

	private speed: number;

	constructor(width:number, height:number, y:number, x:number) {
		document.addEventListener("keydown", this.keyDown); 
		document.addEventListener("keyup", this.keyUp);
		this.width = width;
		this.height = height;
		this.y = y;
		this.x = x;
		this.speed = 2;
		setInterval(this.movements, 1000 / 60);
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

	private movements() { // execution every delay milliseconds
		const speed:number = 10;
		if (this.up && !this.down) {
			this.y -= speed;
		} else if (this.down && !this.up) {
			this.y += speed;
		}
		// if (Game.space && boost === true && (game.ball.x < 20 + PLAYER_WIDTH + 10)
		// 	&& game.ball.y > game.player.y && game.ball.y < game.player.y + PLAYER_HEIGHT)  { 
		// 	console.log("BOOST ON");
		// 	game.ball.speed += 1;
		// 	on = 1;
		// }

		if (this.y < this.x)
			this.y = this.x;
		if (this.y + getCanvas().height > getCanvas().height - this.x)
			this.y = getCanvas().height - this.x - this.height;
		// document.getElementById('player')!.style.top = game.player.y + 'px';
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
		// game.ball.x = canvas.width / 2;
		// game.ball.y = canvas.height / 2;
		// game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		// game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

		// on = 0;
		// print = 0;
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
			// reset();
			if (player === game.player1) {
				game.playerScore2++;
				document.querySelector('#computer-score')!.textContent = String(game.playerScore2);
			} else {
				game.playerScore1++;
				document.querySelector('#player-score')!.textContent = String(game.playerScore1);
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

// class	computerPaddle extends Paddle:any {
// 	constructor(width:number, height:number, y:number, x:number) {
// 		super(width, height, y, x);
// 	}

// 	const computerMove = (ball:Ball, canvas:any) => { // suis la balle a un peu moins que la vitesse de la balle
// 		let i: number = 1;
// 		this.y += ball.speed * Math.sin(ball.direction * Math.PI / 180) * i; //* 0.85;
// 		if (this.y <= 20)
// 			this.y = 20;
// 		if (this.y + this.height >= canvas.height - 20)
// 			this.y = canvas.height - 20 - this.height;
// 	}
// }
// const computerMove = () => { // suis la balle a un peu moins que la vitesse de la balle
// 	let i: number = 1;
// 	game.computer.y += game.ball.speed * Math.sin(game.ball.direction * Math.PI / 180) * i; //* 0.85;
// 	if (game.computer.y <= 20)
// 		game.computer.y = 20;
// 	if (game.computer.y + PLAYER_HEIGHT >= canvas.height - 20)
// 		game.computer.y = canvas.height - 20 - PLAYER_HEIGHT;
// }

// const ballMove = () => {
// 	// on fait en sorte que la balle rebondisse en haut et en bas
// 	if (game.ball.y > canvas.height - 20 || game.ball.y - 20 < 20)
// 		game.ball.direction *= -1;

// 	// le rebond quand la balle touche un joueur
// 	if (game.ball.x > canvas.width - PLAYER_WIDTH - 20)
// 		collide(game.computer);
// 	else if (game.ball.x < PLAYER_WIDTH + 20)
// 		collide(game.player);

// 	game.ball.x += game.ball.speed * Math.cos(game.ball.direction * Math.PI / 180);
// 	game.ball.y += game.ball.speed * Math.sin(game.ball.direction * Math.PI / 180);
// }

// const reset = () => {
// 	game.ball.x = canvas.width / 2;
// 	game.ball.y = canvas.height / 2;
// 	game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
// 	game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

// 	on = 0;
// 	print = 0;
// 	game.ball.speed = 2;
// 	game.ball.direction = Math.random() * 160 - 80; //pour que la direction de depart differe
// }

//const collide = (player: typeof game) => {
//	if (game.ball.y + game.ball.r < player.y || game.ball.y - game.ball.r > player.y + PLAYER_HEIGHT) {
//		// is_play = false
//		console.log("ball at ", game.ball.y)
//		console.log("player at ", player.y)
//		//si le joueur ne tappe pas dans la balle on reinitialise les donnees 
//		reset();
//		if (player === game.player) {
//			game.computer.score++;
//			document.querySelector('#computer-score')!.textContent = game.computer.score;
//		} else {
//			game.player.score++;
//			document.querySelector('#player-score')!.textContent = game.player.score;
//		}

//		if (game.player.score === 1 || game.computer.score === 1)
//			print = 2;

//	} else {
//		// si il la touche la vitesse augmente
//		changeDirection(player.y, player);
//		if (Math.abs(game.ball.speed) < MAX_SPEED && !on) {
//			console.log("NORMAL");
//game.ball.speed *= 1;
//} else if (Math.abs(game.ball.speed) < MAX_SPEED && on && player === game.computer) {
//			console.log("OFF SPEED");
//game.ball.speed -= 1.8;
//game.ball.speed *= 1;
//		}
//	}

//	if (on && player === game.computer) {
//		console.log("BOOST OFF");
//		on = 0;
//		space = false;
//	}
//}

//const changeDirection = (playerPosition:number, player:typeof game) => {
//	console.log("ball.y = ", game.ball.y);
//	console.log("Player .y = ", playerPosition);
//	let impact: number = game.ball.y - playerPosition - PLAYER_HEIGHT / 2.0;
//	if (impact < 0)
//		impact += game.ball.r;
//	else
//		impact -= game.ball.r;

//	const ratio = 100.0 / (PLAYER_HEIGHT / 2.0);
//	console.log("height  ", PLAYER_HEIGHT );
//	console.log("ratio ", ratio);

//	//a une valeur entre -10 et 10 en fonction du point d impact
//	const num: number = Math.round(impact * ratio / 10);
//	if (player === game.computer)
//		game.ball.direction = 180 + num * 8;
//	else
//		game.ball.direction = num * 8;

//	console.log(" Ball touch at ", num, " got this direction " , game.ball.direction);
//}

//const	checkWindow = () => {
//const width  = window.innerWidth || document.documentElement.clientWidth ||
//document.body.clientWidth;
//const height = window.innerHeight|| document.documentElement.clientHeight||
//document.body.clientHeight;
//console.log(width, height, "WIDTH & HEIGHT");
//// if (width < 1000 || height < 1100) {
//// console.log(width, height, "ERROR");
//// print = 1;
//// } else
//if (print === 1) {
//console.log(width, height, "NO ERROR");
//print = 0;
//}
//setUpCanvas(width);
//}

//const setUpCanvas = (width: number) => {
//// Feed the size back to the canvas.
//const oldWidth = canvas.width;
//const oldHeight = canvas.height;
//canvas.width = (width * 1000) / 1100; 
//canvas.height = (width * 600) / 1100;
//if (canvas.width > 1400) {
//canvas.width = 1400;
//}
//if (canvas.height > 800) {
//canvas.height = 800;
//}
////mise a jour des positions des joueurs et de la balle
//game.ball.x = (game.ball.x * canvas.width) / oldWidth;
//game.ball.y = (game.ball.y * canvas.height) / oldHeight;
//game.player.y = (game.player.y * canvas.height) / oldHeight;
//game.computer.y = (game.computer.y * canvas.height) / oldHeight;
//console.log(canvas.width, canvas.height, game.ball.x, game.ball.y, game.player.y, game.computer.y,  "SET UP CANVAS FROM ");
//}

// useEffect(()=> {
// 	canvas = document.getElementById('game-Canvas');
// 	game = {
// 		player: {
// 			y: canvas.height / 2 - PLAYER_HEIGHT / 2,
// 			speed: 0,
// 			score: 0
// 		},
// 		computer: {
// 			y: canvas.height / 2 - PLAYER_HEIGHT / 2,
// 			score: 0
// 		},
// 		ball: {
// 			x: canvas.width / 2,
// 			y: canvas.height / 2,
// 			r: 5,
// 			speed: 0, 
// 			direction: 0
// 		}
// 	}
// 	checkWindow();
// 	reset();

// document.addEventListener("keydown", function(e) {
// 	switch (e.key) {
// 		case "ArrowUp":
// 		case "w":
// 			up = true;
// 			break
// 		case "ArrowDown":
// 		case "s":
// 			down = true;
// 			break
// 		case " ":
// 		case "Shift":
// 			space = true;
// 			break
// 	}
// });

// document.addEventListener("keyup", function(e){
// 	switch (e.key) {
// 		case "ArrowUp":
// 		case "w":
// 			up = false;
// 			break
// 		case "ArrowDown":
// 		case "s":
// 			down = false;
// 			break
// 	}
// });

// window.addEventListener('resize', () => {
// 	// pause();
// 	checkWindow();
// })

// window.setInterval(function show() { // execution every delay milliseconds
// 	const speed:number = 10;
// 	if (up && !down) {
// 		game.player.y -= speed;
// 	} else if (down && !up) {
// 		game.player.y += speed;
// 	}
// 	if (space && boost === true && (game.ball.x < 20 + PLAYER_WIDTH + 10)
// 		&& game.ball.y > game.player.y && game.ball.y < game.player.y + PLAYER_HEIGHT)  { 
// 		console.log("BOOST ON");
// 		game.ball.speed += 1;
// 		on = 1;
// 	}

// 	if (game.player.y < 20)
// 		game.player.y = 20;
// 	if (game.player.y + PLAYER_HEIGHT > canvas.height - 20)
// 		game.player.y = canvas.height - 20 - PLAYER_HEIGHT;
// 	// document.getElementById('player')!.style.top = game.player.y + 'px';
// }, 1000 / 60)
// }, []);
export default function	Launch() {
	// document.addEventListener('DOMContentLoaded', function() {
	const gameRef = useRef<Game | null>(null);

	useEffect(() => {
		gameRef.current = new Game();
	});

	const	handleBoost = () => { gameRef.current!.boost = !gameRef.current!.boost; }

	const	handleBackground = () => {
		gameRef.current!.random = !gameRef.current!.random;
		getCanvas().style.background = gameRef.current!.random ? RandomBG() : 'black';
	}

	const startGame = () => {
		// .... -> useRef.current!. -> ...
	}

	const stopGame = () => {
		// .... -> useRef.current!. -> ...
	}

	const pauseGame = () => {
		// .... -> useRef.current!. -> ...
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
