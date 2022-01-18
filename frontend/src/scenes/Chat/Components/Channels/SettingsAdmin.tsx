import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import MySnackBar from "../../../../components/MySnackbar";
import { ISearchBar, User } from "../../../../services/Interface/Interface";
import MySearchBarChat from "../MySearchBarChat";
import { ROLE } from "../../../../services/Api/Role";
import { Channel } from "../../Services/interface";
import useUsersChannel from "../../Services/useUsersChannel";

function SettingsAdmin(props: { channel: Channel, setOpenSettings: Dispatch<SetStateAction<boolean>>, me: User}) {
	const { channel, setOpenSettings, me } = props;
	const usersChannel = useUsersChannel(channel);
    const [open, setOpen] = useState(true);
	const [modos, setModos] = useState<User[]>(usersChannel.filter(item => item.role === ROLE.MODERATOR));
	const [error, setError] = useState<string>("");

	const [nameChannel, setNameChannel] = useState<string>("");
	const [passwordChannel, setPasswordChannel] = useState<string>("");

	function handleClickCell(user: User) {
		const tmp = modos.filter(item => item.login === user.login)
		if (tmp.length === 0) {
			setModos(modos => [...modos, user])
		}
	}

	const handleRemoveModo = (user: User) => {
		setModos(modos.filter(item => item.login !== user.login))
	}

	const handleClose = () => {
		setOpenSettings(false);
		setOpen(false);
	};

	const handleUpdate = () => {
		setOpenSettings(false);
		setOpen(false);
	}

	const  handleTextChangeName = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setNameChannel(event.target.value);
	};

	const  handleTextChangePassword = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setPasswordChannel(event.target.value);
	};

	const fSearchBar: ISearchBar = {
		handleClickCell: handleClickCell
	};

	const handleDeleteChannel = () => {
		setOpenSettings(false);
		setOpen(false);
		console.log("delete channel");
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
			<DialogTitle>Update channel {channel.name} / Your status : {me.role}</DialogTitle>
			<DialogContent>
				<Box sx={{ flexGrow: 1, marginTop: 1}}>
					<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
						{modos.map((modo) => (
						<Grid item xs={3.5} key={modo.id}>
							<Button onClick={() => handleRemoveModo(modo)} key={modo.id} size="small" variant="contained" endIcon={<CloseIcon />}>
								{modo.login}
					 		</Button>
						</Grid>
						))}
					</Grid>
				</Box>
				<TextField
					autoFocus
					margin="dense"
					id="name_channel"
					label="New channel name"
					type="text"
					fullWidth
					variant="standard"
					onChange={handleTextChangeName}
				/>
				<TextField
					autoFocus
					margin="dense"
					id="password_channel"
					label="New password"
					type="password"
					fullWidth
					variant="standard"
					onChange={handleTextChangePassword}
				/>
				<div style={{marginTop: 10}}></div>
				<MySearchBarChat users={usersChannel} fSearchBar={fSearchBar} nameBar="Search moderateurs..."/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleDeleteChannel} variant="contained" color="error">Delete channel</Button>
				<Button onClick={handleClose} variant="contained" color="warning">Cancel</Button>
				<Button onClick={handleUpdate} variant="contained" color="success">Update</Button>
			</DialogActions>
			{error !== "" ? <MySnackBar message={`${error}`} severity="error" time={3000} setError={setError}/> : null}
		</Dialog>
	);
}

export default SettingsAdmin;