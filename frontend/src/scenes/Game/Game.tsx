import { Paddle } from './Paddle';
import { Ball } from './Ball';
import { getCanvas } from './Launch'


export class	Game {
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
		if (!getCanvas()) {
			return ;
		}
		console.log(getCanvas().clientWidth, getCanvas().clientHeight,  "W & H constr");
		this.context  = getCanvas().getContext("2d");
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
		this.checkWindow();
	}

	draw() {
		if (!getCanvas() || !this.context)
			return ;

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
		this.ball.r = (5 * getCanvas().width) / 1000;
		//ball speed = canvas width / 500 => (1000 longeur de ref / 2-vitesse de ref)
		this.ball.speed = getCanvas().width / 500;
		this.player1.width = (5 * getCanvas().width) / 1000;
		this.player1.height = (100 * getCanvas().height) / 1000;
		this.player2.width = (5 * getCanvas().width) / 1000;
		this.player2.height = (100 * getCanvas().height) / 1000;
		this.player1.y = (this.player1.y * getCanvas().height) / oldHeight;
		this.player2.y = (this.player2.y * getCanvas().height) / oldHeight;
		console.log(this.ball.r, this.player1.width, this.player1.height,  "SET UP CANVAS");
	}

	reset() {
		this.ball.x = getCanvas().width / 2;
		this.ball.y = getCanvas().height / 2;
		this.player1.y = getCanvas().height / 2 - this.player1.height / 2;
		this.player2.y = getCanvas().height / 2 - this.player1.height / 2;

		this.on = 0;
		this.print = 0;
		this.ball.speed = 2;
		this.ball.direction = -(Math.random() * 160 + 10); //pour que la direction de depart differe
	}
}
