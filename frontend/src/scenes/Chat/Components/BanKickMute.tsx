import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogActions, DialogContent, Stack } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { sxButton } from '../../Settings/Services/style';
import { api, apiBan, apiChannel, apiKick, apiMute } from '../../../Services/Api/Api';
import axios from 'axios';
import { useSnackbar } from 'notistack'
import { ROLE } from '../../../Services/Api/Role';
import { IBanKickMute } from '../Services/interface';

export default function BanKickMute(props: {myBanKickMute : IBanKickMute}) {
	const { myBanKickMute } = props;
	const { enqueueSnackbar } = useSnackbar();

	const handleClose = () => {
		myBanKickMute.closeModal(!myBanKickMute.open);
	}

	const printError = (err: any) => {
		enqueueSnackbar(`Error : ${err.response.data.error}`, { 
			variant: 'error',
			autoHideDuration: 3000,
		});
	}

	const handleBanUser = async () => {
		try {
			await axios.put(`${api}${apiChannel}/${myBanKickMute.name_channel}${apiBan}/${myBanKickMute.user.login}`);
			enqueueSnackbar(`${myBanKickMute.user.login} a ete banni du channel ${myBanKickMute.name_channel}`, { 
				variant: 'success',
				autoHideDuration: 3000,
			});
			handleClose();
		}
		catch (err) {
			printError(err);
		}
	}

	const handleUnBanUser = async () => {
		try {
			await axios.delete(`${api}${apiChannel}/${myBanKickMute.name_channel}${apiBan}/${myBanKickMute.user.login}`);
			enqueueSnackbar(`${myBanKickMute.user.login} a ete unbanned du channel ${myBanKickMute.name_channel}`, { 
				variant: 'success',
				autoHideDuration: 3000,
			});
			handleClose();
		}
		catch (err) {
			printError(err);
		}
	}

	const handleMuteUser = async () => {
		try {
			await axios.put(`${api}${apiChannel}/${myBanKickMute.name_channel}${apiMute}/${myBanKickMute.user.login}/10`);
			enqueueSnackbar(`${myBanKickMute.user.login} a ete mute du channel ${myBanKickMute.name_channel}`, { 
				variant: 'success',
				autoHideDuration: 3000,
			});
			handleClose();
		}
		catch (err) {
			printError(err);
		}
	}

	const handleUnMuteUser = async () => {
		try {
			await axios.delete(`${api}${apiChannel}/${myBanKickMute.name_channel}${apiBan}/${myBanKickMute.user.login}`);
			enqueueSnackbar(`${myBanKickMute.user.login} a ete unbanned du channel ${myBanKickMute.name_channel}`, { 
				variant: 'success',
				autoHideDuration: 3000,
			});
			handleClose();
		}
		catch (err) {
			printError(err);
		}
	}

	const handleKickUser = async () => {
		try {
			await axios.put(`${api}${apiChannel}/${myBanKickMute.name_channel}${apiKick}/${myBanKickMute.user.login}`);
			enqueueSnackbar(`${myBanKickMute.user.login} a ete kick du channel ${myBanKickMute.name_channel}`, { 
				variant: 'success',
				autoHideDuration: 3000,
			});
			handleClose();
		}
		catch (err) {
			printError(err);
		}
	}
	return (
		<div>
			<Dialog onClose={handleClose} open={myBanKickMute.open}>
				<DialogTitle sx={{fontFamily: "Myriad Pro"}}>Ban / Kick / Mute</DialogTitle>
				<DialogContent sx={{backgroundColor: "#1d3033"}}>
					<div style={{marginTop: 20}}></div>
					<Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
						<VolumeOffIcon style={{color: "white", fontSize: "40px"}}/>
						<Button sx={sxButton} onClick={handleMuteUser}>Mute {myBanKickMute.user.login}</Button>
					</Stack>
					<div style={{marginTop: 20}}></div>
					<Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
						<ExitToAppIcon style={{color: "white", fontSize: "40px"}}/>
						<Button sx={sxButton} onClick={handleKickUser}>Kick {myBanKickMute.user.login}</Button>
					</Stack>
					<div style={{marginTop: 20}}></div>
					<Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
						<RemoveCircleIcon style={{color: "white", fontSize: "40px"}}/>
						{myBanKickMute.user.role !== ROLE.BANNED ?
							<Button sx={sxButton} onClick={handleBanUser}>Ban {myBanKickMute.user.login}</Button> :
							<Button sx={sxButton} onClick={handleUnBanUser}>UnBan {myBanKickMute.user.login}</Button>
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