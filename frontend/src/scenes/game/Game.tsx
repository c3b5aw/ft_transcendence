import { useEffect } from 'react';
import { Paper, Grid } from "@mui/material";

import GameCanvas from './GameCanvas';
import GameButtons from './GameButtons';
import GameScoreBoard from './GameScoreBoard';
import GameModifiers from './GameModifiers';

const PLAYER_HEIGHT = 100.0;
const PLAYER_WIDTH = 5;
const MAX_SPEED = 12;

export default function Game() {
	var canvas: any;
	var game: any;
	var anim: any;
	var on: number = 0;
	var print: number = 0;
	var boost: boolean, random: boolean = false;
	var up: boolean, down: boolean, space: boolean = false;
	var is_play: boolean = false;

	const draw = () => {
		var context = canvas.getContext('2d');

		//CanvasRenderingContext2D
		//https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D

		//table
		if (random === false) {
			context.fillStyle = 'black';
			context.fillRect(0, 0, canvas.width, canvas.height); //dessine des rectangles
		} else {
			context.clearRect(0, 0, canvas.width, canvas.height);
			// context.drawImage(myimg, 1000, 600);
		}
		if (print === 0) {
		context.lineWidth = 2;
		context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20); //dessine les contours d un rectangle (rectangle interieur) du pong

		context.strokeStyle = 'white';
		context.beginPath();
		context.moveTo(canvas.width / 2, 0 + 10); //depart de la ligne
		context.lineTo(canvas.width / 2, canvas.height - 10); //longueur de la ligne
		context.stroke(); //trace

		//player
		context.fillStyle = 'white';
		context.fillRect(20, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
		context.fillRect(canvas.width - PLAYER_WIDTH - 20, game.computer.y, PLAYER_WIDTH, PLAYER_HEIGHT);

		//ball
		context.beginPath();
		if (on === 0) 
			context.fillStyle = 'white';
		else 
			context.fillStyle = 'red';
		context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false); // permet de tracet un cercle
		context.fill(); //rempli le chemin courant avec la derniere couleur donnee
		} else if (print === 1) {
			context.fillStyle = 'white';
			context.font = '48px serif';
			context.fillText("Error : window's too small", 20 , canvas.height / 2);
		} else if (print === 2) {
			context.fillStyle = 'white';
			context.font = 'bold 100px verdana, sans-serif';
			// console.log(game.player.score, "vs", game.computer.score )
			if (game.player.score > game.computer.score) {
				stopGame();
				context.fillText("VICTORY !", canvas.width / 2 - 200, canvas.height / 2);
			} else {
				stopGame();
				context.fillStyle = 'red';
				context.fillText("DEFEATE !", canvas.width / 2 - 200, canvas.height / 2);
			}
		}
	}

	const play = () => {
		if (!is_play && print === 0) {
			is_play = true;
			anim = requestAnimationFrame(game_loop); //appelle 60 fois par secondes
		} else if (print !== 0) {
			draw();
		}
	}

	const game_loop = () => {
		if (!is_play) {
			return;
		}
		draw();

		computerMove();
		ballMove();
		anim = requestAnimationFrame(game_loop); //appelle 60 fois par secondes
	}

	const pause = () => {
		is_play = false;
		cancelAnimationFrame(anim);
		anim = null;
		// draw();
	}

	const stopGame = () => {
		is_play = false;
		cancelAnimationFrame(anim);
		anim = null;
		reset();
		game.computer.score = 0;
		game.player.score = 0;
		document.querySelector('#computer-score')!.textContent = game.computer.score;
		document.querySelector('#player-score')!.textContent = game.computer.score;
		draw();
	}

	const computerMove = () => { // suis la balle a un peu moins que la vitesse de la balle
		let i: number;
		i = 1;
		game.computer.y += game.ball.speed * Math.sin(game.ball.direction * Math.PI / 180) * i; //* 0.85;
		if (game.computer.y <= 20)
			game.computer.y = 20;
		if (game.computer.y + PLAYER_HEIGHT >= canvas.height - 20)
			game.computer.y = canvas.height - 20 - PLAYER_HEIGHT;
	}

	const ballMove = () => {
		// on fait en sorte que la balle rebondisse en haut et en bas
		if (game.ball.y > canvas.height - 20 || game.ball.y - 20 < 20) {
			game.ball.direction *= -1;
		}

		// le rebond quand la balle touche un joueur
		if (game.ball.x > canvas.width - PLAYER_WIDTH - 20) {
			collide(game.computer);
		} else if (game.ball.x < PLAYER_WIDTH + 20) {
			collide(game.player);
		}

		game.ball.x += game.ball.speed * Math.cos(game.ball.direction * Math.PI / 180);
		game.ball.y += game.ball.speed * Math.sin(game.ball.direction * Math.PI / 180);
	}

	const reset = () => {
		game.ball.x = canvas.width / 2;
		game.ball.y = canvas.height / 2;
		game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
		game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

		on = 0;
		print = 0;
		game.ball.speed = 2;
		game.ball.direction = Math.random() * 160 - 80; //pour que la direction de depart differe
	}

	const collide = (player:typeof game) => {
		if (game.ball.y + game.ball.r < player.y || game.ball.y - game.ball.r > player.y + PLAYER_HEIGHT) {
			// is_play = false
			console.log("ball at ", game.ball.y)
			console.log("player at ", player.y)
			//si le joueur ne tappe pas dans la balle on reinitialise les donnees 
			reset();
			if (player === game.player) {
				game.computer.score++;
				document.querySelector('#computer-score')!.textContent = game.computer.score;
			} else {
				game.player.score++;
				document.querySelector('#player-score')!.textContent = game.player.score;
			}
			if (game.player.score === 1 || game.computer.score === 1) {
				print = 2;
			}
		} else {
			// si il la touche la vitesse augmente
			// var audio = new Audio(myaudiopong)
			// audio.play();
			changeDirection(player.y, player);
			if (Math.abs(game.ball.speed) < MAX_SPEED && !on) {
				console.log("NORMAL");
            	game.ball.speed *= 1;
        	} else if (Math.abs(game.ball.speed) < MAX_SPEED && on && player === game.computer) {
				console.log("OFF SPEED");
            	game.ball.speed -= 1.8;
            	game.ball.speed *= 1;
			}
		}

		if (on && player === game.computer) {
			console.log("BOOST OFF");
			on = 0;
			space = false;
		}
	}

	const changeDirection = (playerPosition:number, player:typeof game) => {
		console.log("ball.y = ", game.ball.y);
		console.log("Player .y = ", playerPosition);
		let impact = game.ball.y - playerPosition - PLAYER_HEIGHT / 2.0;
		if (impact < 0) {
			impact += game.ball.r;
		} else {
			impact -= game.ball.r;
		}
	
		const ratio = 100.0 / (PLAYER_HEIGHT / 2.0);
		console.log("height  ", PLAYER_HEIGHT );
		console.log("ratio ", ratio);

		//a une valeur entre -10 et 10 en fonction du point d impact
		const num:number = Math.round(impact * ratio / 10);
		if (player === game.computer) {
			game.ball.direction = 180 + num * 8;
		} else  {
			game.ball.direction = num * 8;
		}
		console.log(" Ball touch at ", num, " got this direction " , game.ball.direction);
	}
 	
	const	checkWindow = () => {
		const width  = window.innerWidth || document.documentElement.clientWidth ||
		document.body.clientWidth;
		const height = window.innerHeight|| document.documentElement.clientHeight||
		document.body.clientHeight;
		console.log(width, height, "WIDTH & HEIGHT");
		if (width < 1000 || height < 1100) {
			console.log(width, height, "ERROR");
			print = 1;
		} else if (print === 1) {
			console.log(width, height, "NO ERROR");
			print = 0;
		}
		setUpCanvas(width);
	}

    const setUpCanvas = (width:number) => {
    	// Feed the size back to the canvas.
		const oldWidth = canvas.width;
		const oldHeight = canvas.height;
        canvas.width = (width * 1000) / 1100; 
        canvas.height = (width * 600) / 1100;
		if (canvas.width > 1400) {
			canvas.width = 1400;
		}
		if (canvas.height > 800) {
			canvas.height = 800;
		}
		//mise a jour des positions des joueurs et de la balle
		game.ball.x = (game.ball.x * canvas.width) / oldWidth;
		game.ball.y = (game.ball.y * canvas.height) / oldHeight;
		game.player.y = (game.player.y * canvas.height) / oldHeight;
		game.computer.y = (game.computer.y * canvas.height) / oldHeight;
		console.log(canvas.width, canvas.height, game.ball.x, game.ball.y, game.player.y, game.computer.y,  "SET UP CANVAS FROM ");
    }

	useEffect(()=> {
		canvas = document.getElementById('game-Canvas');
		game = {
			player: {
				y: canvas.height / 2 - PLAYER_HEIGHT / 2,
				speed: 0,
				score: 0
			},
			computer: {
				y: canvas.height / 2 - PLAYER_HEIGHT / 2,
				score: 0
			},
			ball: {
				x: canvas.width / 2,
				y: canvas.height / 2,
				r: 5,
				speed: 0, 
				direction: 0
			}
		}
		checkWindow();
		reset();

		document.addEventListener("keydown", function(e) {
			switch (e.key) {
				case "ArrowUp" || "KeyW":
					up = true; break
				case "ArrowDown" || "KeyS":
					down = true; break
				case " " || "Shift":
					space = true; break
			}
		});

		document.addEventListener("keyup", function(e){
			switch (e.key) {
				case "ArrowUp" || "KeyW":
					up = false; break
				case "ArrowDown" || "KeyS":
					down = false; break
			}
		});

		window.addEventListener('resize', () => {
			// pause();
			checkWindow();
		})

		window.setInterval(function show() { // execution every delay milliseconds
			const speed:number = 10;
			if (up && !down) {
				game.player.y -= speed;
			} else if (down && !up) {
				game.player.y += speed;
			}
			if (space && boost === true && (game.ball.x < 20 + PLAYER_WIDTH + 10)
				&& game.ball.y > game.player.y && game.ball.y < game.player.y + PLAYER_HEIGHT)  { 
				console.log("BOOST ON");
				game.ball.speed += 1;
				on = 1;
			}

			if (game.player.y < 20)
				game.player.y = 20;
			if (game.player.y + PLAYER_HEIGHT > canvas.height - 20)
				game.player.y = canvas.height - 20 - PLAYER_HEIGHT;
			document.getElementById('player')!.style.top = game.player.y + 'px';
		}, 1000 / 60)
	}, []);

	const	handleBoost = () => { boost = !boost; }

	const	handleBackground = () => {
		console.log("Random Button");
		random = !random;
		if (random === true) {
			let i = Math.random() * 10;
			if (Math.round(i) % 2)
				canvas.style.background = "#5367B8";
			else
				canvas.style.background = "#DBE070";

		} else {
			canvas.style.background = "black";
		}
	}
	
	return (
		<Grid container
			direction="column" alignItems="center" justifyContent="center"
			style={{ minHeight: '100vh' }}
		>
			<Grid item xs={3}>
				<Paper>
					<GameScoreBoard />
					<GameModifiers boostCallback={ handleBoost } backgroundCallback={ handleBackground } />
					<GameButtons startGame={ play } stopGame= { stopGame } pauseGame={ pause } />
					<GameCanvas />
				</Paper>
			</Grid>
		</Grid>
	);
}