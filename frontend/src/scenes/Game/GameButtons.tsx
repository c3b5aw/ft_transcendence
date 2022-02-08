import { Button, Stack, Typography } from '@mui/material';

export default function GameButtons(props: any) {

	const handlePause = () => {
		if (props.game !== null) {
			props.game.current.socket.emit('game::pause');
		}
	}

	return (
		<Stack direction="row" justifyContent="center" alignItems="center" spacing={{xs: 1, sm: 5}}>
			<Button
				variant="contained"
				color="success"
				onClick={props.backgroundCallback}
			>
				<Typography>Color</Typography>
			</Button>
			<Button
				variant="contained"
				color="warning"
				onClick = {handlePause}
			>
				<Typography>Pause</Typography>
			</Button>
			<Button
				variant="contained"
				color="error"
			>
				<Typography>Quitter</Typography>
			</Button>
		</Stack>
	)
}