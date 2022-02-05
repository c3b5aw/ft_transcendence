import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Paper, Container } from "@mui/material";

import GameCanvas from './GameCanvas';
import GameButtons from './GameButtons';
import GameScoreBoard from './GameScoreBoard';
import GameModifiers from './GameModifiers';
import Game from './Game';
import { RandomBG } from './GameUtils';
import { gameSocket } from '../../Services/ws/utils';


export default function GameBoard() {
	const [ randomBackground, setRandomBackground ] = useState(false);
	const game = useRef<Game | null>(null);

	const { hash } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		axios.get('/api/matchs/' + hash).then(res => {
			if (res.data.length === 0)
				navigate('/game');
			else
				game.current = new Game(gameSocket, res.data[0]);
		});
	}, [ hash, navigate ]);

	const onRandomBackground = () => {
		setRandomBackground(!randomBackground);

		document.getElementById('game-canvas')!.style.background = randomBackground ? RandomBG() : 'black';
	}

	return (
		<Container maxWidth="xl">
			<Paper>
				<GameScoreBoard />
				<GameModifiers backgroundCallback={ onRandomBackground } />
				{/* <GameButtons startGame={ play } stopGame= { stopGame } pauseGame={ pause } /> */}
				<GameCanvas />
			</Paper>
		</Container>
	);
}