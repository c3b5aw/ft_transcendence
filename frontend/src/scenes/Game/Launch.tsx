import { useEffect, useRef } from 'react';
import { Paper, Grid } from "@mui/material";
import GameCanvas from './GameCanvas';
import GameButtons from './GameButtons';
import GameScoreBoard from './GameScoreBoard';
import GameModifiers from './GameModifiers';

import { Game } from './Game';

import { RandomBG } from './GameUtils';

// const myimg = require('./hearthstone.jpg');

export function	getCanvas() {
	const canvas : any =  document.getElementById('game-Canvas');
	return canvas;
}

export default function	Launch() {
	const gameRef = useRef<Game | null>(null);

	useEffect(() => {
		gameRef.current = new Game();
	},[]);

	const	handleBoost = () => { gameRef.current!.boost = !gameRef.current!.boost; }

	const	handleBackground = () => {
		gameRef.current!.random = !gameRef.current!.random;
		getCanvas().style.background = gameRef.current!.random ? RandomBG() : 'black';
		// getCanvas().style.background = "url(" + myimg + ")";
	}

	const startGame = () => {
		gameRef.current!.play();
	}

	const stopGame = () => {
		gameRef.current!.stopGame();
	}

	const pauseGame = () => {
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
