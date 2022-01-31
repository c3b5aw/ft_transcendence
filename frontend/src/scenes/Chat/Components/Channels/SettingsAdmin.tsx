import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import { ISearchBar, User } from "../../../../Services/Interface/Interface";
import { api, apiChannel, apiModos } from "../../../../Services/Api/Api";
import axios from "axios";
import { useSnackbar } from 'notistack'
import { ISettingAdmin } from "../../Services/interface";
import useUsersChannel from "../../Services/Hooks/useUsersChannel";
import CloseIcon from '@mui/icons-material/Close';
import MySearchBarChat from "../MySearchBarChat";

function SettingsAdmin(props: { mySettingsAdmin: ISettingAdmin }) {
	const { enqueueSnackbar } = useSnackbar();
	const { mySettingsAdmin } = props;
	const usersChannel = useUsersChannel(mySettingsAdmin.channel);
	const [modos, setModos] = useState<User[]>([]);

	const [nameChannel, setNameChannel] = useState<string>("");
	const [passwordChannel, setPasswordChannel] = useState<string>("");

	const printError = (err: any) => {
		enqueueSnackbar(`Error : ${err.response.data.error}`, { 
			variant: 'error',
			autoHideDuration: 3000,
		});
	}

	async function handleAddModo(user: User) {
		const tmp = modos.filter(item => item.login === user.login)
		if (tmp.length === 0) {
			try {
				await axios.put(`${api}${apiChannel}/${mySettingsAdmin.channel.name}/moderator/${user.login}`);
				setModos(modos => [...modos, user]);
				enqueueSnackbar(`${user.login} a été ajouté en tant que moderateur de ${mySettingsAdmin.channel.name}`, { 
					variant: 'success',
					autoHideDuration: 2000,
				});
			}
			catch (err: any) {
				printError(err);
			}
		}
		else {
			enqueueSnackbar(`Impossible d'ajouter ${user.login}`, { 
				variant: 'warning',
				autoHideDuration: 3000,
			});
		}
	}

	useEffect(() => {
		const fetchModosChannel = async () => {
			try {
				const response = await axios.get(`${api}${apiChannel}/${mySettingsAdmin.channel.name}${apiModos}`);
				setModos(response.data);
			}
			catch (err) {
				enqueueSnackbar(`La liste des modérateurs n'a pas pu etre chargée (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchModosChannel();
	}, [mySettingsAdmin.channel.name, enqueueSnackbar]);

	const handleRemoveModo = async (user: User) => {
		try {
			await axios.delete(`${api}${apiChannel}/${mySettingsAdmin.channel.name}/moderator/${user.login}`);
			setModos(modos.filter(item => item.login !== user.login));
			enqueueSnackbar(`${user.login} a été supprimé de la liste des moderateurs de ${mySettingsAdmin.channel.name}`, { 
				variant: 'success',
				autoHideDuration: 2000,
			});
		}
		catch (err: any) {
			printError(err);
		}
	}

	const handleClose = () => {
		mySettingsAdmin.closeModal(!mySettingsAdmin.open);
		mySettingsAdmin.updateListChannels();
	};

	const handleDeleteChannel = async () => {
		try {
			await axios.delete(`${api}${apiChannel}/${mySettingsAdmin.channel.name}`);
			enqueueSnackbar(`Le channel ${mySettingsAdmin.channel.name} a été supprimé`, { 
				variant: 'success',
				autoHideDuration: 2000,
			});
			handleClose();
		}
		catch (err: any) {
			printError(err);
		}
	}

	const handleUpdate = async () => {
		if (passwordChannel.length > 0) {
			try {
				await axios.post(`${api}${apiChannel}/${mySettingsAdmin.channel.name}/password`, {
					password: passwordChannel
				});
				enqueueSnackbar(`Le password du channel ${mySettingsAdmin.channel.name} a été modifié`, { 
					variant: 'success',
					autoHideDuration: 2000,
				});
				handleClose();
			}
			catch (err: any) {
				printError(err);
			}
		}
		if (nameChannel.length > 0) {
			try {
				await axios.post(`${api}${apiChannel}/${mySettingsAdmin.channel.name}/name`, {
					name: nameChannel,
				});
				enqueueSnackbar(`Le nom du channel a été modifié par ${nameChannel}`, { 
					variant: 'success',
					autoHideDuration: 2000,
				});
				handleClose();
			}
			catch (err: any) {
				printError(err);
			}
		}
		else
			handleClose();
	}

	const  handleTextChangeName = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setNameChannel(event.target.value);
	};

	const  handleTextChangePassword = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setPasswordChannel(event.target.value);
	};

	const fSearchBar: ISearchBar = {
		handleClickCell: handleAddModo
	};

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
			<DialogTitle>Update channel {mySettingsAdmin.channel.name}</DialogTitle>
			<DialogContent>
				<Box sx={{ flexGrow: 1, marginTop: 1}}>
					<Grid
						container
						rowSpacing={1}
						columnSpacing={{ xs: 1, sm: 2, md: 3 }}
					>
						{modos.map((modo) => (
						<Grid
							item
							xs={3.5}
							key={modo.id}
						>
							<Button
								onClick={() => handleRemoveModo(modo)}
								key={modo.id}
								size="small"
								variant="contained"
								endIcon={<CloseIcon />}
							>
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
		</Dialog>
	);
}

export default SettingsAdmin;