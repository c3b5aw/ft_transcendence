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
import { Avatar, IconButton, Stack, Switch, Typography } from '@mui/material';
import { ROLE } from '../../../Services/Api/Role';
import { useSnackbar } from 'notistack'
import { Channel } from '../../Chat/Services/interface';
import DeleteIcon from '@mui/icons-material/Delete';
import NumbersIcon from '@mui/icons-material/Numbers';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import useUsers from '../../../Services/Hooks/useUsers';
import useCountMatchs from '../Services/useCountMatchs';

export default function MyInfosUser() {

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

	function RowUser(props: { user: User }) {
		const { user } = props;
		const [banned, setBanned] = useState<boolean>(user.role === ROLE.BANNED ? true : false);
		const modo = user.role === ROLE.MODERATOR ? true : false;
		const proprio = user.role === ROLE.ADMIN ? true : false;
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
						autoHideDuration: 2000,
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
						autoHideDuration: 2000,
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
		const handleBanned = async () => {
			changeStatus(user, setBanned, reload2, setReload2, banned, ROLE.BANNED);
		}

		return (
		<React.Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: 'white' }}>
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
					<Switch checked={modo} disabled/>
				</TableCell>
				<TableCell align="center">
					<Switch checked={proprio} disabled/>
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
					autoHideDuration: 2000,
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
				<TableCell>{channel.owner_login}</TableCell>
				<TableCell>{channel.private ? "private" : "public"}</TableCell>
				<TableCell align="center" onClick={() => navigate(`${apiChat}`)}>{channel.name}</TableCell>
				<TableCell align="center">
					<IconButton onClick={() => handleDeleteChannel()}>
						<DeleteIcon style={{color: "#C0392B"}}/>
					</IconButton>
				</TableCell>
			</TableRow>
		</React.Fragment>
		);
	}

	const countMatchs = useCountMatchs();

	if (users === undefined || countMatchs === undefined)
		return (<MyChargingDataAlert />);
	return (
		<Stack sx={{width: 1, height: "100vh"}} direction="column" spacing={5}>
			<Stack sx={{backgroundColor: "white", width: 1, height: 0.5, borderRadius: 5}}>
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
							<RowUser key={user.id} user={user}/>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Stack>
			<Stack sx={{backgroundColor: "white", width: 1, height: 0.5, borderRadius: 5}}>
				<TableContainer sx={{borderRadius: 5}}>
					<Table aria-label="collapsible table">
						<TableHead sx={{backgroundColor: "orange"}}>
							<TableRow>
								<TableCell><p style={{fontFamily: "Myriad Pro", fontSize:"21px"}}>Channels</p></TableCell>
								<TableCell><p style={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Owner</p></TableCell>
								<TableCell><p style={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Status</p></TableCell>
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
			<Stack sx={{width: 0.5}} direction={{ xs: 'column', sm: 'column', md: 'column', lg: 'row' }} justifyContent="space-between">
				<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Nombre de matchs : {countMatchs}</Typography>
				<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Nombre de joueurs : {users.length}</Typography>
			</Stack>
		</Stack>
	);
}

