import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import MySnackBar from "../../../../components/MySnackbar";
import { User } from "../../../../services/Interface/Interface";
import { Channel } from "../../Services/interface";
import LockIcon from '@mui/icons-material/Lock';
import useUserChannel from "../../Services/useUserChannel";

function SettingsM(props: { channel: Channel, setOpenSettings: Dispatch<SetStateAction<boolean>>, me: User}) {
	const { channel, setOpenSettings, me } = props;
    const [open, setOpen] = useState(true);
	const [error, setError] = useState<string>("");
	const insideChannel = useUserChannel(channel, me);

	const [passwordChannel, setPasswordChannel] = useState<string>("");

	const handleClose = () => {
		setOpenSettings(false);
		setOpen(false);
	};

	const  handleCheckPassword = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setPasswordChannel(event.target.value);
	};

	const handleValidPassword = () => {
		setOpenSettings(false);
		setOpen(false);
		console.log(passwordChannel);
	}

	const handleQuitChannel = () => {
		// try {
		// 	await axios.put(`${api}${apiChannel}`)
		// }
		setOpenSettings(false);
		setOpen(false);
		console.log("Je quitte le channel");
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
					{insideChannel ? <div>Your status : {me.role}</div> : null}
				</Stack>
			</DialogTitle>
			{insideChannel ?
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
							onChange={handleCheckPassword}
						/>
					</Stack>
					<div style={{marginTop: 10}}></div>
				</DialogContent> : null
			}
			<DialogActions>
				<Button onClick={handleClose} variant="contained" color="error">Cancel</Button>
				{insideChannel ?
					<Button onClick={handleValidPassword} variant="contained" color="success">Valider</Button> :
					<Button onClick={handleQuitChannel} variant="contained" color="success">Quitter</Button>
				}
			</DialogActions>
			{error !== "" ? <MySnackBar message={`${error}`} severity="error" time={3000} setError={setError}/> : null}
		</Dialog>
	);
}

export default SettingsM;