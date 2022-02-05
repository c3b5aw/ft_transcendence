import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { api, apiBan, apiChannel, apiKick, apiMute } from '../../../Services/Api/Api';
import axios from 'axios';
import { useSnackbar } from 'notistack'
import { ROLE } from '../../../Services/Api/Role';
import { IBanKickMute } from '../Services/interface';
import { isMute } from '../Services/utils';

export default function BanKickMute(props: {myBanKickMute : IBanKickMute}) {
	const { myBanKickMute } = props;
	const { enqueueSnackbar } = useSnackbar();

	const handleClose = () => {
		myBanKickMute.closeModal(!myBanKickMute.open);
	}

	const printError = (err: any) => {
		enqueueSnackbar(`Error : ${err}`, { 
			variant: 'error',
			autoHideDuration: 3000,
		});
	}

	const handleBanUser = async () => {
		try {
			await axios.put(`${api}${apiChannel}/${myBanKickMute.name_channel}${apiBan}/${myBanKickMute.user.login}`);
			enqueueSnackbar(`${myBanKickMute.user.login} a ete banni du channel ${myBanKickMute.name_channel}`, { 
				variant: 'success',
				autoHideDuration: 2000,
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
				autoHideDuration: 2000,
			});
			handleClose();
		}
		catch (err) {
			printError(err);
		}
	}

	const handleMuteUser = async () => {
		try {
			await axios.put(`${api}${apiChannel}/${myBanKickMute.name_channel}${apiMute}/${myBanKickMute.user.login}/100`);
			enqueueSnackbar(`${myBanKickMute.user.login} a ete mute du channel ${myBanKickMute.name_channel}`, { 
				variant: 'success',
				autoHideDuration: 2000,
			});
			handleClose();
		}
		catch (err) {
			printError(err);
		}
	}

	const handleUnMuteUser = async () => {
		try {
			await axios.delete(`${api}${apiChannel}/${myBanKickMute.name_channel}${apiMute}/${myBanKickMute.user.login}`);
			enqueueSnackbar(`${myBanKickMute.user.login} a ete unmuted du channel ${myBanKickMute.name_channel}`, { 
				variant: 'success',
				autoHideDuration: 2000,
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
				autoHideDuration: 2000,
			});
			handleClose();
		}
		catch (err) {
			printError(err);
		}
	}

	function HandleMuteUser() {
		if (isMute(myBanKickMute.user)) {
			return (<Button
				variant="contained"
				onClick={handleUnMuteUser}
			>
				<Typography>UnMute {myBanKickMute.user.login}</Typography>
			</Button>
			);
		}
		return (
			<Button
				variant="contained"
				onClick={handleMuteUser}
			>
				<Typography>Mute {myBanKickMute.user.login}</Typography>
			</Button>
		);
	}

	return (
		<div>
			<Dialog
				onClose={handleClose}
				open={myBanKickMute.open}
			>
				<DialogTitle sx={{fontFamily: "Myriad Pro"}}>
					Ban / Kick / Mute
				</DialogTitle>
				<DialogContent sx={{backgroundColor: "#1d3033"}}>
					<div style={{marginTop: 20}}></div>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="center"
						spacing={2}
					>
						<VolumeOffIcon style={{color: "white", fontSize: "40px"}}/>
						<HandleMuteUser />
					</Stack>
					<div style={{marginTop: 20}}></div>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="center"
						spacing={2}
					>
						<ExitToAppIcon style={{color: "white", fontSize: "40px"}}/>
						<Button variant="contained" onClick={handleKickUser}>
							<Typography>Kick {myBanKickMute.user.login}</Typography>
						</Button>
					</Stack>
					<div style={{marginTop: 20}}></div>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="center"
						spacing={2}
					>
						<RemoveCircleIcon style={{color: "white", fontSize: "40px"}}/>
						{myBanKickMute.user.role !== ROLE.BANNED ?
							<Button variant="contained" onClick={handleBanUser}>
								<Typography>Ban {myBanKickMute.user.login}</Typography>
							</Button> :
							<Button variant="contained" onClick={handleUnBanUser}>
								<Typography>UnBan {myBanKickMute.user.login}</Typography>
							</Button>
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