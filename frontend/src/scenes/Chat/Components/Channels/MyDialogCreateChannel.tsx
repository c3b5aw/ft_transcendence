import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { User } from "../../../../Services/Interface/Interface";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { api, apiChannel } from "../../../../Services/Api/Api";
import { useSnackbar } from 'notistack'

function MyDialogCreateChannel(props: {reload: boolean, setReload: Dispatch<SetStateAction<boolean>>}) {
	const { reload, setReload } = props;
    const [open, setOpen] = React.useState(true);
	const [addFriends, setAddFriends] = useState<User[]>([]);

	const [nameChannel, setNameChannel] = useState<string>("");
	const [passwordChannel, setPasswordChannel] = useState<string>("");

	const { enqueueSnackbar } = useSnackbar();

	const handleRemoveFriend = (user: User) => {
		setAddFriends(addFriends.filter(item => item.login !== user.login))
	}

	const handleClose = () => {
		setOpen(false);
	};

	const handleCreate = async () => {
		if (nameChannel.length > 3 && nameChannel.length < 64) {
			try {
				await axios.post(`${api}${apiChannel}`, {
					name: nameChannel,
					password: passwordChannel
				})
				enqueueSnackbar(`Le channel ${nameChannel} a été crée`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
				handleClose();
				setReload(!reload);
			}
			catch (err) {
				enqueueSnackbar(`Le channel ${nameChannel} n'a pas pu etre crée (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		else {
			enqueueSnackbar(`Le nom du channel doit contenir au moins 3 caractères`, { 
				variant: 'warning',
				autoHideDuration: 3000,
			});
		}
	};

	const  handleTextChangeName = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setNameChannel(event.target.value);
	};

	const  handleTextChangePassword = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setPasswordChannel(event.target.value);
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
			<DialogTitle>New channel</DialogTitle>
			<DialogContent>
				<Box sx={{ flexGrow: 1, marginTop: 1}}>
					<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
						{addFriends.map((friend) => (
						<Grid item xs={3.5} key={friend.id}>
							<Button onClick={() => handleRemoveFriend(friend)} key={friend.id} size="small" variant="contained" endIcon={<CloseIcon />}>
								{friend.login}
					 		</Button>
						</Grid>
						))}
					</Grid>
				</Box>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Channel name"
					type="text"
					fullWidth
					variant="standard"
					onChange={handleTextChangeName}
				/>
				<TextField
					autoFocus
					margin="dense"
					id="password"
					label="Channel password"
					type="password"
					fullWidth
					variant="standard"
					onChange={handleTextChangePassword}
				/>
				<div style={{marginTop: 10}}></div>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleCreate}>Create</Button>
			</DialogActions>
		</Dialog>
	);
}

export default MyDialogCreateChannel;