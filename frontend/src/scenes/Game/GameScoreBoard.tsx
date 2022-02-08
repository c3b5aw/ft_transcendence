import { Grid, Typography, Paper, Avatar } from '@mui/material';
import GamePlayer from './GamePlayer';

function GameAvatar(props: { position: string, login: string }) {
	return (
		<Grid item display={{ xs: 'none', sm: 'flex' }}>
			<Avatar id={ `gamePlayerAvatar` + props.position }
				src={props.login === "" ? "https://better-default-discord.netlify.app/Icons/Pastel-Blue.png" : `/api/users/${props.login}/avatar`}
			/>
		</Grid>
	)
}

function GamePlayerHeader(props: { position: string, players: GamePlayer[] }) {
	return (
		<Grid container 
			direction="row" justifyContent="flex-start" alignItems="center"
			spacing={ 3 }
		>
			<Grid item />
			{ props.position === "Left" && <GameAvatar position={ props.position } login={props.players.length === 0 ? "" : props.players[0].login}/> }
			<Grid item>
				{ props.position === "Left" ?
					<Typography variant="h5" id={ `gamePlayer` + props.position }>
						{props.players.length === 0 ? "..." : props.players[0].login}
					</Typography> : props.position === "Right" ?
					<Typography variant="h5" id={ `gamePlayer` + props.position }>
						{props.players.length === 0 ? "..." : props.players[1].login}
					</Typography> : null
				}
			</Grid>
			{ props.position === "Right" && <GameAvatar position={ props.position } login={props.players.length === 0 ? "" : props.players[1].login}/> }
			<Grid item />
		</Grid>
	)
}

function GameScores(props: {players: GamePlayer[]}) {
	return (
		<Grid container
			direction="row" justifyContent="center" alignItems="center"
			spacing={ 3 }
		>
			<Grid item>
				<Typography variant="h5" id="gamePlayerScoreLeft">
					{props.players.length === 0 ? "0" : `${props.players[0].score}`}
				</Typography>
			</Grid>
			<Grid item>
				<Typography variant="h5">
					|
				</Typography>
			</Grid>
			<Grid item>
				<Typography variant="h5" id="gamePlayerScoreRight">
					{props.players.length === 0 ? "0" : `${props.players[1].score}`}
				</Typography>
			</Grid>
		</Grid>
	)
}

export default function GameScoreBoard(props: {players: GamePlayer[]}) {
	return (
		<Paper elevation={ 4 } sx={{
			borderRadius: '0px',
			padding: 2
		}}>
			<Grid container
				direction={{ xs: 'column', sm: 'row' }}
				justifyContent="space-between" alignItems="center"
			>
				<Grid item>
					<GamePlayerHeader position="Left" players={props.players}/>
				</Grid>
				<Grid item>
					<GameScores players={props.players}/>
				</Grid>
				<Grid item>
					<GamePlayerHeader position="Right" players={props.players}/>
				</Grid>
			</Grid>
		</Paper>
	)
}