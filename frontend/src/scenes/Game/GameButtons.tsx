import { Button, IconButton, Stack, Typography } from '@mui/material';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function GameButtons(props: any) {
	const navigate = useNavigate();

	const handlePause = () => {
		if (props.game !== null) {
			props.game.current.socket.emit('game::pause');
		}
	}

	const handleQuit = () => {
		if (props.isSpectator)
			navigate(-1);
		else {
			if (props.game !== null) {
				props.game.current.onSurrender();
			}
		}
	}

	return (
		<Stack direction="row" justifyContent="space-around" sx={{width: 1, padding: 1}}>
			<Stack direction="row" justifyContent="center" alignItems="center" spacing={{xs: 1, sm: 5}}>
				{!props.isSpectator ? 
					<React.Fragment>
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
					</React.Fragment> : null
				}
				<Button
					variant="contained"
					color="error"
					onClick={handleQuit}
				>
					<Typography>Quitter</Typography>
				</Button>
			</Stack>
			<Stack direction="row" spacing={3}>
				{!props.playSound ?
					<IconButton onClick={() => props.setPlaySound(true)}>
						<VolumeUpIcon />
					</IconButton> : 
					<IconButton onClick={() => props.setPlaySound(false)}>
						<VolumeMuteIcon />
					</IconButton>
				}
			</Stack>
		</Stack>
	)
}