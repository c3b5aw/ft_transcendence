import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React from "react";
import { Channel } from "../Services/interface";

function MyDialogSettingsChannel(props: {channel: Channel}) {
	const { channel } = props;
    const [open, setOpen] = React.useState(true);

	const handleClose = () => {
		setOpen(false);
	};

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
			<DialogTitle>Edit Channel {channel.name}</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Channel name"
					type="text"
					fullWidth
					variant="standard"
				/>
				<TextField
					autoFocus
					margin="dense"
					id="password"
					label="Channel password"
					type="password"
					fullWidth
					variant="standard"
				/>
				<div style={{marginTop: 10}}></div>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleClose}>Create</Button>
			</DialogActions>
		</Dialog>
	);
}

export default MyDialogSettingsChannel;