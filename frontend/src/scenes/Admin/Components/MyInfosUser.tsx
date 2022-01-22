import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { api, apiAdmin, apiBan, apiChannel, apiChannels, apiChat, apiStats, apiUsers } from "../../../Services/Api/Api";
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { User } from '../../../Services/Interface/Interface';
import { Avatar, IconButton, Stack, Switch } from '@mui/material';
import { ROLE } from '../../../Services/Api/Role';
import { useSnackbar } from 'notistack'
import { Channel } from '../../Chat/Services/interface';
import DeleteIcon from '@mui/icons-material/Delete';
import NumbersIcon from '@mui/icons-material/Numbers';

export default function MyInfosUser(props: {me: User | undefined }) {

	const { me } = props;
	const [reload, setReload] = useState<boolean>(false);
	const [reload2, setReload2] = useState<boolean>(false);
	const [channels, setChannels] = useState<Channel[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
		const fetchChannels = async () => {
			try {
				const response = await axios.get(`${api}${apiChannels}`);
				setChannels(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de récupérer la liste des channels (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchChannels();
	}, [enqueueSnackbar, reload]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}`);
				setUsers(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de récupérer la liste des users (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchUsers();
	}, [enqueueSnackbar, reload2]);

	function RowUser(props: { user: User, me: User | undefined }) {
		const { user, me } = props;
		const [banned, setBanned] = useState<boolean>(user.role === ROLE.BANNED ? true : false);
		const [modo, setModo] = useState<boolean>(user.role === ROLE.MODERATOR ? true : false);
		const [proprio, setProprio] = useState<boolean>(user.role === ROLE.ADMIN ? true : false);
		const navigate = useNavigate();

		async function changeStatus(
			user: User,
			setStatus: Dispatch<SetStateAction<boolean>>,
			reload: boolean,
			setReload: Dispatch<SetStateAction<boolean>>,
			status1: boolean,
			status2: ROLE,
		) {
		if (status1) {
			try {
				await axios.delete(`${api}${apiAdmin}${apiBan}/${user.login}`);
				enqueueSnackbar(`Reçu`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
				setStatus(!status1);
				setReload(!reload);
			}
			catch (err) {
				enqueueSnackbar(`(${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		else {
			try {
				await axios.put(`${api}${apiAdmin}${apiBan}/${user.login}`);
				enqueueSnackbar(`Reçu`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
				setStatus(!status1);
				setReload(!reload);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de bannir ${user.login} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
	}

		// const handleBanned = async () => {
		// 	if (banned) {
		// 		try {
		// 			await axios.delete(`${api}${apiAdmin}${apiBan}/${user.login}`);
		// 			enqueueSnackbar(`${user.login} a été débanni`, { 
		// 				variant: 'success',
		// 				autoHideDuration: 3000,
		// 			});
		// 			setBanned(!banned);
		// 		}
		// 		catch (err) {
		// 			enqueueSnackbar(`Impossible de débannir ${user.login} (${err})`, { 
		// 				variant: 'error',
		// 				autoHideDuration: 3000,
		// 			});
		// 		}
		// 	}
		// 	else {
		// 		try {
		// 			await axios.put(`${api}${apiAdmin}${apiBan}/${user.login}`);
		// 			enqueueSnackbar(`${user.login} a été banni`, { 
		// 				variant: 'success',
		// 				autoHideDuration: 3000,
		// 			});
		// 			setBanned(!banned);
		// 			setReload(!reload);
		// 		}
		// 		catch (err) {
		// 			enqueueSnackbar(`Impossible de bannir ${user.login} (${err})`, { 
		// 				variant: 'error',
		// 				autoHideDuration: 3000,
		// 			});
		// 		}
		// 	}
		// }
		const handleBanned = async () => {
			changeStatus(user, setBanned, reload2, setReload2, banned, ROLE.BANNED);
		}

		const handleModo = async () => {
			if (modo) {
				try {
					// await axios.delete(`${api}${apiAdmin}${apiBan}/${user.login}`);
					enqueueSnackbar(`${user.login} n'est plus modérateur`, { 
						variant: 'success',
						autoHideDuration: 3000,
					});
					setModo(!modo);
					setReload(!reload);
				}
				catch (err) {
					enqueueSnackbar(`Impossible de retirer le status de modérateur à ${user.login} (${err})`, { 
						variant: 'error',
						autoHideDuration: 3000,
					});
				}
			}
			else {
				try {
					// await axios.put(`${api}${apiAdmin}${apiBan}/${user.login}`);
					enqueueSnackbar(`${user.login} est maintenant modérateur`, { 
						variant: 'success',
						autoHideDuration: 3000,
					});
					setModo(!modo);
					setReload(!reload);
				}
				catch (err) {
					enqueueSnackbar(`Impossible de donner le status de modérateur à ${user.login} (${err})`, { 
						variant: 'error',
						autoHideDuration: 3000,
					});
				}
			}
		}

		const handleProprio = async () => {
			if (proprio) {
				try {
					// await axios.delete(`${api}${apiAdmin}${apiBan}/${user.login}`);
					enqueueSnackbar(`${user.login} n'est plus propriétaire du site`, { 
						variant: 'success',
						autoHideDuration: 3000,
					});
					setProprio(!proprio);
					setReload(!reload);
				}
				catch (err) {
					enqueueSnackbar(`Impossible de retirer le status de propriétaire à ${user.login} (${err})`, { 
						variant: 'error',
						autoHideDuration: 3000,
					});
				}
			}
			else {
				try {
					// await axios.put(`${api}${apiAdmin}${apiBan}/${user.login}`);
					enqueueSnackbar(`${user.login} est maintenant propriétaire`, { 
						variant: 'success',
						autoHideDuration: 3000,
					});
					setProprio(!proprio);
					setReload(!reload);
				}
				catch (err) {
					enqueueSnackbar(`Impossible de donner le status de propriétaire à ${user.login} (${err})`, { 
						variant: 'error',
						autoHideDuration: 3000,
					});
				}
			}
		}

		return (
		<React.Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: user.login === me?.login ? 'cyan' : 'white' }}>
				<TableCell>
					<Avatar
						src={`http://127.0.0.1/api/users/${user.login}/avatar`}
						sx={{ width: "48px", height: "48px" }}>
					</Avatar>
				</TableCell>
				<TableCell onClick={() => navigate(`${apiStats}/${user.login}`)} component="th" scope="row">{user.id}</TableCell>
				<TableCell align="center" sx={{color: '#C70039', fontFamily: "Myriad Pro"}}>{user.login} ({user.role})</TableCell>
				<TableCell align="center">{user.email}</TableCell>
				<TableCell align="center">
					{user.role !== ROLE.ADMIN ?
						<Switch checked={banned} onChange={handleBanned}/> :
						<Switch disabled/>
					}
				</TableCell>
				<TableCell align="center">
					<Switch checked={modo} onChange={handleModo}/>
				</TableCell>
				<TableCell align="center">
					<Switch checked={proprio} onChange={handleProprio}/>
				</TableCell>
			</TableRow>
		</React.Fragment>
		);
	}

	function RowChannel(props: { channel: Channel }) {
		const { channel } = props;
		const navigate = useNavigate();
		const { enqueueSnackbar } = useSnackbar();

		const handleDeleteChannel = async () => {
			try {
				await axios.delete(`${api}${apiChannel}/${channel.name}`);
				enqueueSnackbar(`Le channel ${channel.name} a été supprimé`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
				setReload(!reload);
			}
			catch (err) {
				enqueueSnackbar(`Le channel ${channel.name} n'a pas pu etre supprimé (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}

		return (
		<React.Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: 'white' }}>
				<TableCell>
					<NumbersIcon style={{fontSize: '32px'}}></NumbersIcon>
				</TableCell>
				<TableCell>{channel.private ? "private" : "public"}</TableCell>
				<TableCell align="center" onClick={() => navigate(`${apiChat}`)}>{channel.name}</TableCell>
				<TableCell align="center">
					<IconButton onClick={() => handleDeleteChannel()}>
						<DeleteIcon />
					</IconButton>
				</TableCell>
			</TableRow>
		</React.Fragment>
		);
	}

	return (
		<Stack sx={{width: 1, height: 0.94}} direction="column" spacing={5}>
			<Stack sx={{backgroundColor: "white", width: 1, height: 0.47, borderRadius: 5}}>
				<TableContainer sx={{borderRadius: 5}}>
					<Table aria-label="collapsible table">
						<TableHead sx={{backgroundColor: "green"}}>
							<TableRow>
								<TableCell><p style={{fontFamily: "Myriad Pro", fontSize:"21px"}}>Users</p></TableCell>
								<TableCell><p style={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Id</p></TableCell>
								<TableCell align="center" sx={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Login</TableCell>
								<TableCell align="center" sx={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Email</TableCell>
								<TableCell align="center" sx={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Ban</TableCell>
								<TableCell align="center" sx={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Modérateur</TableCell>
								<TableCell align="center" sx={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Propriétaire</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
							<RowUser key={user.id} user={user} me={me}/>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Stack>
			<Stack sx={{backgroundColor: "white", width: 1, height: 0.47, borderRadius: 5}}>
				<TableContainer sx={{borderRadius: 5}}>
					<Table aria-label="collapsible table">
						<TableHead sx={{backgroundColor: "orange"}}>
							<TableRow>
								<TableCell><p style={{fontFamily: "Myriad Pro", fontSize:"21px"}}>Channels</p></TableCell>
								<TableCell><p style={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Private</p></TableCell>
								<TableCell align="center" sx={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Name</TableCell>
								<TableCell align="center" sx={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Delete</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{channels.map((channel) => (
							<RowChannel key={channel.id} channel={channel}/>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Stack>
		</Stack>
	);
}

