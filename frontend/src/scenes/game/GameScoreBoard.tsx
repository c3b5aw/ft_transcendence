import { Grid, Typography, Paper, Avatar } from '@mui/material';

function GameAvatar(props: any) {
	return (
		<Grid item>
			<Avatar src="/api/users/sbeaujar/avatar" />
		</Grid>
	)
}

function GamePlayer(props: any) {
	return (
		<Grid container 
			direction="row" justifyContent="flex-start" alignItems="center"
			spacing={ 3 }
		>
			<Grid item />
			{ props.position === "left" && <GameAvatar /> }
			<Grid item>
				<Typography variant="h5">
					Player 1
				</Typography>
			</Grid>
			{ props.position === "right" && <GameAvatar /> }
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
				<Typography variant="h5">
					1
				</Typography>
			</Grid>
			<Grid item>
				<Typography variant="h5">
					|
				</Typography>
			</Grid>
			<Grid item>
				<Typography variant="h5">
					0
				</Typography>
			</Grid>
		</Grid>
	)
}

export default function GameScoreBoard() {
	return (
		<Paper elevation={ 4 }
			style={{ minHeight: "60px" }}
		>
			<Grid container
				direction="row" justifyContent="space-between" alignItems="center"
				style={{ height: "60px" }}
			>
				<Grid item>
					<GamePlayer position="left" />
				</Grid>
				<Grid item>
					<GameScores />
				</Grid>
				<Grid item>
					<GamePlayer position="right" />
				</Grid>
			</Grid>
		</Paper>
	)
}