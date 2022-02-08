import { Button, IconButton, Stack, Typography } from '@mui/material';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export default function GameButtons(props: any) {

	const handlePause = () => {
		if (props.game !== null) {
			props.game.current.socket.emit('game::pause');
		}
	}

	return (
		<Stack direction="row" justifyContent="space-around" sx={{width: 1}}>
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
			<Stack direction="row" spacing={3}>
				<IconButton>
					<VolumeUpIcon />
				</IconButton>
				<IconButton>
					<VolumeMuteIcon />
				</IconButton>
			</Stack>
		</Stack>
	)
}