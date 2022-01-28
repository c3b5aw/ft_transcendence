import { Grid, Button } from '@mui/material';

export default function GameButtons(props: any) {
	return (
		<Grid container direction="row" justifyContent="center" alignItems="center">
			<Button variant="contained" color="success" onClick = { props.startGame }> Start</Button>
			<Button variant="contained" color="success" onClick = { props.stopGame }> Stop</Button>
			<Button variant="contained" color="primary" onClick = { props.pauseGame }> Pause</Button>
		</Grid>
	)
}