import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ISearchBar, User } from "../../../../Services/Interface/Interface";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { api, apiChannel, apiDM } from "../../../../Services/Api/Api";
import { useSnackbar } from 'notistack'
import MySearchBarChat from "../MySearchBarChat";
import useFriends from "../../Services/Hooks/useFriends";

function MyDialogCreateChannel(props: {setOpen: Dispatch<SetStateAction<boolean>> }) {
	const { setOpen } = props;
    const [openDM, setOpenDM] = React.useState(false);
	const [friend, setFriend] = useState<User>();
	const friends = useFriends();

	const [nameChannel, setNameChannel] = useState<string>("");
	const [passwordChannel, setPasswordChannel] = useState<string>("");

	const { enqueueSnackbar } = useSnackbar();

	const handleRemoveFriend = () => {
		setFriend(undefined);
	}

	const handleClose = () => {
		setOpen(false);
	};

	function handleAddFriend(user: User) {
		setFriend(user);
	}

	const handleCreate = async () => {
		if (openDM) {
			if (friend !== undefined) {
				await axios.post(`${api}${apiChannel}${apiDM}`, {
					login: friend.login,
				})
				handleClose();
			}
			else {
				enqueueSnackbar(`Veuillez selectionner un ami`, { 
					variant: 'warning',
					autoHideDuration: 3000,
				});
			}
		}
		else if (nameChannel.length > 3 && nameChannel.length < 64) {
			try {
				await axios.post(`${api}${apiChannel}`, {
					name: nameChannel,
					password: passwordChannel
				})
				enqueueSnackbar(`Le channel ${nameChannel} a été crée`, { 
					variant: 'success',
					autoHideDuration: 2000,
				});
				handleClose();
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
	
	const fSearchBar: ISearchBar = {
		handleClickCell: handleAddFriend
	}

	const handleChange = () => {
		setOpenDM(!openDM)
	}

    return (
        <Dialog
			open={true}
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
				{!openDM ?
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Channel name"
						type="text"
						fullWidth
						variant="standard"
						onChange={handleTextChangeName}
					/> : null
				}
				{!openDM ?
					<TextField
						autoFocus
						margin="dense"
						id="password"
						label="Channel password"
						type="password"
						fullWidth
						variant="standard"
						onChange={handleTextChangePassword}
					/> : null
				}
				<div style={{marginTop: 10}}></div>
				<FormControlLabel
					value="start"
					control={<Checkbox onChange={handleChange}/>}
					label="Do you want to create a DM channel ? "
				/>
				{openDM ? 
					<React.Fragment>
						<MySearchBarChat
							users={friends}
							fSearchBar={fSearchBar}
							nameBar="Search your friend..."
						/>
						<div style={{marginTop: 10}}></div>
						{friend !== undefined ? 
							<Button 
								onClick={() => handleRemoveFriend()}
								key={friend.login}
								size="small"
								variant="contained"
								endIcon={<CloseIcon />}
							>
								{friend.login}
							</Button> : null}
						</React.Fragment> : null
					}
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="error" onClick={handleClose}>Cancel</Button>
				<Button variant="contained" color="success" onClick={handleCreate}>Create</Button>
			</DialogActions>
		</Dialog>
	);
}

export default MyDialogCreateChannel;