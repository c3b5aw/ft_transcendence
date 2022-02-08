import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

import { Paper, Container, Stack } from "@mui/material";

import useMe from '../../Services/Hooks/useMe';

import GameCanvas from './GameCanvas';
import GameButtons from './GameButtons';
import GameScoreBoard from './GameScoreBoard';
import Game from './Game';
import { RandomBG } from './GameUtils';
import MyChargingDataAlert from '../../components/MyChargingDataAlert';
import GameEnd from './GameEnd';
import GamePlayer from './GamePlayer';


export default function GameBoard() {
	const [ randomBackground, setRandomBackground ] = useState(false);
	const [isFinished, setIsFinished] = useState<boolean>(false);
	const [players, setPlayers] = useState<GamePlayer[]>([]);
	const game = useRef<Game | null>(null);

	const { hash } = useParams();
	const navigate = useNavigate();

	const gameSocket = useRef<Socket | null>(null);

	const me = useMe();

	const handleFinished = (players: GamePlayer[]) => {
		setPlayers(players)
		setIsFinished(true);
	}

	const handleQuit = () => {
		setIsFinished(false);
		navigate('/game/roomview');
	}

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
				game.current = new Game(gameSocket.current, res.data[0], me, handleFinished);
		});
	}, [ hash, navigate, gameSocket, me ]);

	const onRandomBackground = () => {
		setRandomBackground(!randomBackground);
		document.getElementById('game-canvas')!.style.background = randomBackground ? RandomBG() : 'black';
	}
	if (me === undefined) {
		return (
			<MyChargingDataAlert />
		);
	}
	return (
		<Container maxWidth="xl">
			<Paper>
				<Stack direction="column" spacing={2}>
					<GameScoreBoard players={players}/>
					<GameButtons me={me} game={game} backgroundCallback={ onRandomBackground }/>
					<GameCanvas />
					{isFinished ? <GameEnd handleQuit={handleQuit} players={players}/> : null}
				</Stack>
			</Paper>
		</Container>
	);
}