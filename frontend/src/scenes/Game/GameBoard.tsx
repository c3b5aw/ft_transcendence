import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSound from 'use-sound';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

import { Paper, Container, Stack } from "@mui/material";

import useMe from '../../Services/Hooks/useMe';

import GameCanvas from './GameCanvas';
import GameButtons from './GameButtons';
import GameScoreBoard from './GameScoreBoard';
import Game from './Game';
import { RandomBG } from './GameUtils';
import GamePlayer from './GamePlayer';
import MyChargingDataAlert from '../../components/MyChargingDataAlert';
import GameEnd from './GameEnd';

export default function GameBoard() {
	const [ randomBackground, setRandomBackground ] = useState(false);
	const [isFinished, setIsFinished] = useState<boolean>(false);
	const [players, setPlayers] = useState<GamePlayer[]>([]);
	const [isSpectator, setIsSpectator] = useState<boolean>(false);
	const [winner, setWinner] = useState(null);
	
	const [ playSound, setPlaySound ] = useState(true);
	const [ play ] = useSound('/sounds/onCollide.mp3', { interrupt: true });

	const playCollideSound = useCallback(() => { if (playSound) play() }, [ play, playSound ]);

	const game = useRef<Game | null>(null);

	const { hash } = useParams();
	const navigate = useNavigate();

	const gameSocket = useRef<Socket | null>(null);

	const me = useMe();

	const handleFinished = (players: GamePlayer[], arg: any) => {
		setPlayers(players)
		setWinner(arg.winner);
		console.log(arg);
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
				game.current = new Game(gameSocket.current, res.data[0], me, handleFinished, playCollideSound);
			
			if (me.id !== res.data[0].player1 && me.id !== res.data[0].player2)
				setIsSpectator(true);
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hash, navigate, gameSocket, me]);

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
					<GameButtons
						me={me}
						game={game}
						backgroundCallback={onRandomBackground}
						setPlaySound={setPlaySound}
						playSound={playSound}
						isSpectator={isSpectator}
					/>
					<GameCanvas />
					{isFinished ? <GameEnd me={me} handleQuit={handleQuit} players={players} winner={winner}/> : null}
				</Stack>
			</Paper>
		</Container>
	);
}