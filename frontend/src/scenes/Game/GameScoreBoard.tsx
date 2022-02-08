import { Grid, Typography, Paper, Avatar } from '@mui/material';

function GameAvatar(props: { position: string }) {
	return (
		<Grid item display={{ xs: 'none', sm: 'flex' }}>
			<Avatar id={ `gamePlayerAvatar` + props.position }
				src="https://better-default-discord.netlify.app/Icons/Pastel-Blue.png"
			/>
		</Grid>
	)
}

function GamePlayer(props: { position: string }) {
	return (
		<Grid container 
			direction="row" justifyContent="flex-start" alignItems="center"
			spacing={ 3 }
		>
			<Grid item />
			{ props.position === "Left" && <GameAvatar position={ props.position }/> }
			<Grid item>
				<Typography variant="h5" id={ `gamePlayer` + props.position }>
					...
				</Typography>
			</Grid>
			{ props.position === "Right" && <GameAvatar position={ props.position }/> }
			<Grid item />
		</Grid>
	)
}

function GameScores() {
	return (
		<Grid container
			direction="row" justifyContent="center" alignItems="center"
			spacing={ 3 }
		>
			<Grid item>
				<Typography variant="h5" id="gamePlayerScoreLeft">
					0
				</Typography>
			</Grid>
			<Grid item>
				<Typography variant="h5">
					|
				</Typography>
			</Grid>
			<Grid item>
				<Typography variant="h5" id="gamePlayerScoreRight">
					0
				</Typography>
			</Grid>
		</Grid>
	)
}

export default function GameScoreBoard() {
	return (
		<Paper elevation={ 4 } sx={{
			borderRadius: '0px',
		}}>
			<Grid container
				direction={{ xs: 'column', sm: 'row' }}
				justifyContent="space-between" alignItems="center"
			>
				<Grid item>
					<GamePlayer position="Left" />
				</Grid>
				<Grid item>
					<GameScores />
				</Grid>
				<Grid item>
					<GamePlayer position="Right" />
				</Grid>
			</Grid>
		</Paper>
	)
}