import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { User } from "../../../../services/Interface/Interface";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import { api, apiChannel } from "../../../../services/Api/Api";
import MySnackBar from "../../../../components/MySnackbar";

function MyDialogCreateChannel(props: {reload: boolean, setReload: Dispatch<SetStateAction<boolean>>}) {
	const { reload, setReload } = props;
    const [open, setOpen] = React.useState(true);
	const [addFriends, setAddFriends] = useState<User[]>([]);

	const [nameChannel, setNameChannel] = useState<string>("");
	const [passwordChannel, setPasswordChannel] = useState<string>("");

	const [error, setError] = useState<string>("");

	// function handleClickCell(user: User) {
	// 	const tmp = addFriends.filter(item => item.login === user.login)
	// 	if (tmp.length === 0) {
	// 		setAddFriends(addFriends => [...addFriends, user])
	// 	}
	// }

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
				setError("Le channel a bien été créer");
				handleClose();
				setReload(!reload);
			}
			catch (err) {
				setError(err as string);
			}
		}
		else
			setError("Le nom du channel doit contenir au moins 3 caractères");
	};

	const  handleTextChangeName = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setNameChannel(event.target.value);
	};

	const  handleTextChangePassword = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setPasswordChannel(event.target.value);
	};

	// const fSearchBar: ISearchBar = {
	// 	handleClickCell: handleClickCell
	// }
	
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
				{/* <MySearchBarChat users={users} fSearchBar={fSearchBar} /> */}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleCreate}>Create</Button>
			</DialogActions>
			{error !== "" ? <MySnackBar message={`${error}`} severity="error" time={3000} setError={setError}/> : null}
		</Dialog>
	);
}

export default MyDialogCreateChannel;