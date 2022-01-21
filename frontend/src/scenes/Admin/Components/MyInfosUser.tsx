import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { api, apiAdmin, apiBan, apiStats } from "../../../Services/Api/Api";
import { useState } from 'react';
import { User } from '../../../Services/Interface/Interface';
import { Avatar, Stack, Switch } from '@mui/material';
import { ROLE } from '../../../Services/Api/Role';
import { useSnackbar } from 'notistack'

export default function MyInfosUser(props: {me: User | undefined, users: User[]}) {

	const { me } = props;
	const { users } = props;

	function Row(props: { user: User, me: User | undefined }) {
		const { user } = props;
		const { me } = props;
		const navigate = useNavigate();
		const [banned, setBanned] = useState<boolean>(user.role === "BANNED" ? true : false);
		const { enqueueSnackbar } = useSnackbar();

		const handleBanned = async () => {
			if (banned) {
				try {
					await axios.delete(`${api}${apiAdmin}${apiBan}/${user.login}`);
					enqueueSnackbar(`${user.login} a été débanni`, { 
						variant: 'success',
						autoHideDuration: 3000,
					});
					setBanned(!banned);
				}
				catch (err) {
					enqueueSnackbar(`Impossible de débannir ${user.login} (${err})`, { 
						variant: 'error',
						autoHideDuration: 3000,
					});
				}
			}
			else {
				try {
					await axios.put(`${api}${apiAdmin}${apiBan}/${user.login}`);
					enqueueSnackbar(`${user.login} a été banni`, { 
						variant: 'success',
						autoHideDuration: 3000,
					});
					setBanned(!banned);
				}
				catch (err) {
					enqueueSnackbar(`Impossible de bannir ${user.login} (${err})`, { 
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
			<TableCell align="center">{user.victories}</TableCell>
			<TableCell align="center">
				{user.role !== ROLE.ADMIN ?
					<Switch checked={banned} onChange={handleBanned}/> :
					<Switch disabled/>
				}
			</TableCell>
			</TableRow>
		</React.Fragment>
		);
	}
	return (
		<Stack sx={{backgroundColor: "white", width: 1, height: 0.82, borderRadius: 5}} direction="column">
			<TableContainer>
				<Table aria-label="collapsible table">
					<TableHead>
						<TableRow>
							<TableCell><p style={{fontFamily: "Myriad Pro", fontSize:"21px"}}>Users</p></TableCell>
							<TableCell><p style={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Id</p></TableCell>
							<TableCell align="center" sx={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Login</TableCell>
							<TableCell align="center" sx={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Email</TableCell>
							<TableCell align="center" sx={{fontFamily: "Myriad Pro", fontSize:"17px"}}>Ban</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
						<Row key={user.id} user={user} me={me}/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
}
