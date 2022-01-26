import { Button, Dialog, DialogActions, DialogTitle, Stack } from "@mui/material";
import { ISettingM } from "../../Services/interface";

function SettingsM(props: { mySettingsM: ISettingM }) {
	const { mySettingsM } = props;

	const handleClose = () => {
		mySettingsM.closeModal(!mySettingsM.open);
	};

	const handleQuitChannel = () => {
		mySettingsM.handleQuitChannel(mySettingsM.channel);
		handleClose();
	}

	return (
		<Dialog
			open={mySettingsM.open}
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
					<div>{mySettingsM.channel.name}</div>
				</Stack>
			</DialogTitle>
			<DialogActions>
				<Button onClick={handleClose} variant="contained" color="error">Cancel</Button>
				<Button onClick={handleQuitChannel} variant="contained" color="success">Quitter</Button>
			</DialogActions>
		</Dialog>
	);
}

export default SettingsM;