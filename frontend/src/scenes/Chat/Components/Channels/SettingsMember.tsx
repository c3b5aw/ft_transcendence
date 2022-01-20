import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { User } from "../../../../services/Interface/Interface";
import { Channel } from "../../Services/interface";
import LockIcon from '@mui/icons-material/Lock';
import useUserChannel from "../../Services/useUserChannel";
import { useSnackbar } from 'notistack'

function SettingsM(props: { channel: Channel, setOpenSettings: Dispatch<SetStateAction<boolean>>, reload: boolean, setReload: Dispatch<SetStateAction<boolean>>, me: User}) {
	const { channel, setOpenSettings, reload, setReload, me } = props;
    const [open, setOpen] = useState(true);
	const insideChannel = useUserChannel(channel, me);
	const { enqueueSnackbar } = useSnackbar();

	const [passwordChannel, setPasswordChannel] = useState<string>("");

	const handleClose = () => {
		setOpenSettings(false);
		setOpen(false);
	};

	const  handleChangeValuePassword = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setPasswordChannel(event.target.value);
	};

	const handleValidPassword = () => {
		console.log(passwordChannel);
	}

	const handleEnterChannel = () => {
		// channel::join
		handleValidPassword();
		enqueueSnackbar(`${me.login} a été ajouté au channel ${channel.name}`, { 
			variant: 'success',
			autoHideDuration: 3000,
		});
		handleClose();
	}

	const handleQuitChannel = () => {
		// channel::leave
		enqueueSnackbar(`${me.login} a quitté le channel ${channel.name}`, { 
			variant: 'success',
			autoHideDuration: 3000,
		});
		handleClose()
		setReload(!reload);
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				style: {
				  backgroundColor: '#FFFFFF',
				  color:'black'
				},
			  }}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle>
				<Stack direction="row" spacing={3}>
					<div>{channel.name}</div>
					{!insideChannel ? <div>Your status : {me.role}</div> : null}
				</Stack>
			</DialogTitle>
			{!insideChannel && channel.private ?
				<DialogContent>
					<Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
						<LockIcon fontSize="large"/>
						<TextField
							autoFocus
							margin="dense"
							id="password_channel"
							label="Enter password"
							type="password"
							fullWidth
							variant="standard"
							onChange={handleChangeValuePassword}
						/>
					</Stack>
					<div style={{marginTop: 10}}></div>
				</DialogContent> : null
			}
			<DialogActions>
				<Button onClick={handleClose} variant="contained" color="error">Cancel</Button>
				{!insideChannel && channel.private ?
					<Button onClick={handleValidPassword} variant="contained" color="success">Valider</Button> : !insideChannel && !channel.private ?
					<Button onClick={handleEnterChannel} variant="contained" color="success">Entrer</Button> :
					<Button onClick={handleQuitChannel} variant="contained" color="success">Quitter</Button>
				}
			</DialogActions>
		</Dialog>
	);
}

export default SettingsM;