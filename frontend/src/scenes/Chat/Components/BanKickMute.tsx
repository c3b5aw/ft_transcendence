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
import { api, apiBan, apiChannel, apiKick, apiMute } from '../../../Services/Api/Api';
import { Channel } from '../Services/interface';
import axios from 'axios';
import { useSnackbar } from 'notistack'
import { ROLE } from '../../../Services/Api/Role';

export default function BanKickMute(props: {
		setOpen: React.Dispatch<React.SetStateAction<boolean>>,
		user: User, channel: Channel | undefined,
		reload: boolean,
		setReload: React.Dispatch<React.SetStateAction<boolean>>
	}) {
	const { setOpen, user, channel, reload, setReload } = props;
	const [open, setOpen2] = React.useState(true);
	const { enqueueSnackbar } = useSnackbar();

	const handleClose = () => {
		setOpen2(false);
		setOpen(false);
	};

	const handleBanUser = async () => {
		if (channel !== undefined) {
			try {
				await axios.put(`${api}${apiChannel}/${channel.name}${apiBan}/${user.login}`);
				enqueueSnackbar(`${user.login} a ete banni du channel ${channel.name}`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
				handleClose();
			}
			catch (err) {
				enqueueSnackbar(`Impossible de bannir ${user.login} du channel ${channel.name} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
				handleClose();
			}
			console.log("Ban user");
		}
	}

	const handleUnBanUser = async () => {
		if (channel !== undefined) {
			try {
				await axios.delete(`${api}${apiChannel}/${channel.name}${apiBan}/${user.login}`);
				enqueueSnackbar(`${user.login} a ete unbanned du channel ${channel.name}`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
				handleClose();
			}
			catch (err) {
				enqueueSnackbar(`Impossible d'unbanned ${user.login} du channel ${channel.name} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
				handleClose();
			}
			console.log("UnBan user");
		}
	}

	const handleMuteUser = async () => {
		if (channel !== undefined) {
			try {
				await axios.put(`${api}${apiChannel}/${channel.name}${apiMute}/${user.login}/5`);
				enqueueSnackbar(`${user.login} a ete mute du channel ${channel.name}`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
				handleClose();
			}
			catch (err) {
				enqueueSnackbar(`Impossible de mute ${user.login} du channel ${channel.name} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
				handleClose();
			}
			console.log("Ban user");
		}
	}

	const handleUnMuteUser = async () => {
		if (channel !== undefined) {
			try {
				await axios.delete(`${api}${apiChannel}/${channel.name}${apiBan}/${user.login}`);
				enqueueSnackbar(`${user.login} a ete unbanned du channel ${channel.name}`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
				handleClose();
			}
			catch (err) {
				enqueueSnackbar(`Impossible d'unbanned ${user.login} du channel ${channel.name} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
				handleClose();
			}
			console.log("UnBan user");
		}
	}

	const handleKickUser = async () => {
		if (channel !== undefined) {
			try {
				await axios.put(`${api}${apiChannel}/${channel.name}${apiKick}/${user.login}`);
				enqueueSnackbar(`${user.login} a ete kick du channel ${channel.name}`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
				setReload(!reload);
				handleClose();
			}
			catch (err) {
				enqueueSnackbar(`Impossible de kick ${user.login} du channel ${channel.name} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
				handleClose();
			}
			console.log("UnBan user");
		}
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
						{user.role !== ROLE.BANNED ?
							<Button sx={sxButton} onClick={handleBanUser}>Ban {user.login}</Button> :
							<Button sx={sxButton} onClick={handleUnBanUser}>UnBan {user.login}</Button>
						}
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