import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogActions, DialogContent, Stack } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { sxButton } from '../../Settings/Services/style';
import { User } from '../../../Services/Interface/Interface';

export default function BanKickMute(props: {setOpen: React.Dispatch<React.SetStateAction<boolean>>, user: User}) {
	const { setOpen, user } = props;
	const [open, setOpen2] = React.useState(true);

	const handleClose = () => {
		setOpen(false);
		setOpen2(false);
	};

	const handleBanUser = async () => {
		//channel::ban
		console.log("Ban user");
		handleClose();
	}

	const handleKickUser = async () => {
		//channel::kick
		console.log("Kick user");
		handleClose();
	}

	const handleMuteUser = async () => {
		//channel::mute
		console.log("Mute user");
		handleClose();
	}

	return (
		<div>
			<Dialog onClose={handleClose} open={open}>
				<DialogTitle sx={{fontFamily: "Myriad Pro"}}>Ban / Kick / Mute</DialogTitle>
				<DialogContent sx={{backgroundColor: "#1d3033"}}>
					<div style={{marginTop: 20}}></div>
					<Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
						<VolumeOffIcon style={{color: "white", fontSize: "40px"}}/>
						<Button sx={sxButton} onClick={handleMuteUser}>Mute {user.login}</Button>
					</Stack>
					<div style={{marginTop: 20}}></div>
					<Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
						<ExitToAppIcon style={{color: "white", fontSize: "40px"}}/>
						<Button sx={sxButton} onClick={handleKickUser}>Kick {user.login}</Button>
					</Stack>
					<div style={{marginTop: 20}}></div>
					<Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
						<RemoveCircleIcon style={{color: "white", fontSize: "40px"}}/>
						<Button sx={sxButton} onClick={handleBanUser}>Ban {user.login}</Button>
					</Stack>
				</DialogContent>
				<DialogActions sx={{backgroundColor: "#1d3033"}}>
					<Button sx={{
						border: "4px solid black",
						borderRadius: "15px",
						color: "black",
						fontFamily: "Myriad Pro",
						padding: "15px",
						backgroundColor: "white",
						fontSize: "15px",
						'&:hover': {
							backgroundColor: '#D5D5D5',
							color: '#000000',
						},
					}}
					onClick={handleClose}>OK</Button>
				</DialogActions>
				</Dialog>
		</div>
	);
}