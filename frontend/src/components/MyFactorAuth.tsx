import { Button, Dialog, DialogActions, DialogContent, Stack, TextField } from "@mui/material";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { sxButton } from "../scenes/Settings/Services/style";
import { api, api2fa, apiConnection } from "../Services/Api/Api";
import { styleTextField } from "../styles/Styles";

function MyFactorAuth(props: {setOpenQrcode: Dispatch<SetStateAction<boolean>>, turnon: boolean}) {
	const { setOpenQrcode, turnon } = props;
	const classes = styleTextField()
	const [password, setPassword] = useState<string>("");
	const [open, setOpen] = useState<boolean>(true);

	const handleClose = () => {
		setOpen(false);
		setOpenQrcode(false);
	}

	const handleTurnOn = async () => {
		try {
			const response = await axios.post(`${api}${api2fa}/turn-on`, { 
				twoFactorAuthenticationCode: password,
			})
			console.log(response.data);
		}
		catch (err) {
			console.log(err);
		}
	}

	const handleAuthenticated = async () => {
		try {
			await axios.post(`${api}${api2fa}/authenticate`, { 
				twoFactorAuthenticationCode: password,
			})
			// eslint-disable-next-line no-self-assign
			window.location.href = window.location.href;
		}
		catch (err) {
			window.location.href = `${apiConnection}`;
		}
	}

	const handleConnection = () => {
		console.log(password);
		if (turnon)
			handleTurnOn();
		else
			handleAuthenticated();
		handleClose();
	}

	const  handleTextInputChange = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setPassword(event.target.value);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				style: {
				  backgroundColor: '#1d3033',
				  color:'black'
				},
			  }}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogContent>
				<Stack
					direction="column"
					spacing={2}
					margin={7}
					alignItems="center"
					justifyContent="center"
				>
					{turnon ? <h1 style={{color: 'white'}}>Generate qrcode...</h1> :
					<h1 style={{color: 'white'}}>Enter Code</h1>}
					{turnon ? <img src="/api/2fa/generate" alt="qrcode"></img> : null}
					<TextField
						className={classes.styleTextField}
						required
						id="outlined-required"
						label="Enter code..."
						defaultValue=""
						onChange= {handleTextInputChange}
						InputProps={{
							style: {
								color: "white",
							}
						}}
						InputLabelProps={{
							style: { color: '#ADADAD' },
							}}
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					sx={sxButton}
					onClick={handleClose}
				>
					Cancel
				</Button>
				<Button
					sx={sxButton}
					onClick={handleConnection}
				>
					Connection
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default MyFactorAuth;