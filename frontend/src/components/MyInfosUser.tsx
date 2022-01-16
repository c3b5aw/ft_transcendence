import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { api, apiAdmin, apiBan, apiStats, apiUsers } from "../services/Api/Api";
import { useEffect, useState } from 'react';
import { User } from '../services/Interface/Interface';
import { Avatar, Divider, Stack, Switch } from '@mui/material';

export default function MyInfosUser(props: {me: User | undefined, users: User[]}) {

	const { me } = props;
	const { users } = props;
	

	function Row(props: { user: User, me: User | undefined }) {
		const { user } = props;
		const { me } = props;
		const navigate = useNavigate();
		const [banned, setBanned] = useState<boolean>(false);

		useEffect(() => {
		}, [banned]);

		const UnBanned = async () => {
			await axios.delete(`${api}${apiAdmin}${apiBan}/${user.login}`);
			setBanned(!banned);
		}

		const Banned = async () => {
			await axios.put(`${api}${apiAdmin}${apiBan}/${user.login}`);
			setBanned(!banned);
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
			<TableCell align="center" sx={{color: '#C70039', fontFamily: "Myriad Pro"}}>{user.login}</TableCell>
			<TableCell align="center">{user.victories}</TableCell>
			<TableCell align="center">
				{user.banned ?
					<Switch defaultChecked onChange={() => UnBanned()}></Switch> :
					<Switch onChange={() => Banned()}></Switch>
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

