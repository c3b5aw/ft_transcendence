import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { ISearchBar, User } from "../../../../Services/Interface/Interface";
import MySearchBarChat from "../MySearchBarChat";
import { Channel } from "../../Services/interface";
import useUsersChannel from "../../Services/useUsersChannel";
import { api, apiChannel, apiModos } from "../../../../Services/Api/Api";
import axios from "axios";
import { useSnackbar } from 'notistack'

function SettingsAdmin(props: { channel: Channel, setOpenSettings: Dispatch<SetStateAction<boolean>>, reload: boolean, setReload: Dispatch<SetStateAction<boolean>>, me: User}) {
	const { enqueueSnackbar } = useSnackbar();
	const { channel, setOpenSettings, me, reload, setReload } = props;
	const usersChannel = useUsersChannel(channel);
    const [open, setOpen] = useState(true);
	const [modos, setModos] = useState<User[]>([]);

	const [nameChannel, setNameChannel] = useState<string>("");
	const [passwordChannel, setPasswordChannel] = useState<string>("");

	async function handleAddModo(user: User) {
		const tmp = modos.filter(item => item.login === user.login)
		if (tmp.length === 0) {
			try {
				await axios.put(`${api}${apiChannel}/${channel.name}/moderator/${user.login}`);
				setModos(modos => [...modos, user]);
				enqueueSnackbar(`${user.login} a été ajouté en tant que moderateur de ${channel.name}`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
			}
			catch (err) {
				enqueueSnackbar(`Impossible d'ajouter ${user.login} comme modérateur de ${channel.name} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
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
				const response = await axios.get(`${api}${apiChannel}/${channel.name}${apiModos}`);
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
	}, [channel.name, enqueueSnackbar]);

	const handleRemoveModo = async (user: User) => {
		try {
			await axios.delete(`${api}${apiChannel}/${channel.name}/moderator/${user.login}`);
			setModos(modos.filter(item => item.login !== user.login));
			enqueueSnackbar(`${user.login} a été supprimé de la liste des moderateurs de ${channel.name}`, { 
				variant: 'success',
				autoHideDuration: 3000,
			});
		}
		catch (err) {
			enqueueSnackbar(`Impossible de supprimer ${user.login} de la liste des modérateurs de ${channel.name} (${err})`, { 
				variant: 'error',
				autoHideDuration: 3000,
			});
		}
	}

	const handleClose = () => {
		setOpen(false);
		setOpenSettings(false);
	};

	const handleDeleteChannel = async () => {
		try {
			await axios.delete(`${api}${apiChannel}/${channel.name}`);
			enqueueSnackbar(`Le channel ${channel.name} a été supprimé`, { 
				variant: 'success',
				autoHideDuration: 3000,
			});
			handleClose();
			setReload(!reload);
		}
		catch (err) {
			enqueueSnackbar(`Le channel ${channel.name} n'a pas pu etre supprimé (${err})`, { 
				variant: 'error',
				autoHideDuration: 3000,
			});
		}
	}

	const handleUpdate = async () => {
		if (passwordChannel.length > 0) {
			try {
				await axios.post(`${api}${apiChannel}/${channel.name}/password`, {
					password: passwordChannel
				});
				enqueueSnackbar(`Le password du channel ${channel.name} a été modifié`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
				handleClose();
			}
			catch (err) {
				enqueueSnackbar(`Le password du channel ${channel.name} n'a pas pu etre modifié (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
				console.log(err);
			}
		}
		if (nameChannel.length > 0) {
			try {
				await axios.post(`${api}${apiChannel}/${channel.name}/name`, {
					name: nameChannel,
				});
				enqueueSnackbar(`Le nom du channel a été modifié par ${nameChannel}`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
				handleClose();
				setReload(!reload);
			}
			catch (err) {
				enqueueSnackbar(`Le nom du channel n'a pas pu etre modifié (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
				console.log(err);
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
	// console.log(modos);
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
			<DialogTitle>Update channel {channel.name}</DialogTitle>
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
		</Dialog>
	);
}

export default SettingsAdmin;