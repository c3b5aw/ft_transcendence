import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

import { Paper, Container } from "@mui/material";

import useMe from '../../Services/Hooks/useMe';

import GameCanvas from './GameCanvas';
import GameButtons from './GameButtons';
import GameScoreBoard from './GameScoreBoard';
import GameModifiers from './GameModifiers';
import Game from './Game';
import { RandomBG } from './GameUtils';


export default function GameBoard() {
	const [ randomBackground, setRandomBackground ] = useState(false);
	const game = useRef<Game | null>(null);

	const { hash } = useParams();
	const navigate = useNavigate();

	const gameSocket = useRef<Socket | null>(null);

	const me = useMe();

	useEffect(() => {
		if (me === undefined || me === null)
			return ;

		gameSocket.current = io('/game', {
			withCredentials: true
		})

		if (gameSocket.current === null)
			return ;

		axios.get('/api/matchs/' + hash).then(res => {
			if (res.data.length === 0)
				navigate('/game');
			else
				game.current = new Game(gameSocket.current, res.data[0], me);
		});
	}, [ hash, navigate, gameSocket ]);

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