import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { api, apiLadder, apiMatch, apiStats, apiUsers } from "../services/Api/Api";
import { useEffect, useState } from 'react';
import { Match, User } from '../services/Interface/Interface';
import { Stack } from '@mui/material';
import MyChargingDataAlert from './MyChargingDataAlert';
import MyError from './MyError';
import MySnackBar from './MySnackbar';

function Row(props: { user: User, me: User}) {
	const [open, setOpen] = React.useState(false);
	const [matchs, setMatchs] = React.useState<Match[]>([]);
	const [error, setError] = React.useState<unknown>("");
	const { user } = props;
	const { me } = props;
	const navigate = useNavigate();
	
	useEffect(() => {
		const fetchMatchs = async () => {
			try {
				if (user)
				{
					const reponse = await axios.get(`${api}${apiUsers}/${user.login}${apiMatch}`);
					setMatchs(reponse.data);
				}
			} catch (err) {
				setError(err)
			}
		}
		// eslint-disable-next-line eqeqeq
		if (open && me != undefined)
			fetchMatchs();
	}, [user, open, me])

	return (
		<React.Fragment>
		<TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: user.login === me?.login ? 'orange' : 'white' }}>
			<TableCell>
			<IconButton
				aria-label="expand row"
				size="small"
				onClick={() => setOpen(!open)}
			>
				{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
			</IconButton>
			</TableCell>
			<TableCell onClick={() => navigate(`${apiStats}/${user.login}`)} component="th" scope="row">{user.login}</TableCell>
			<TableCell align="center" sx={{color: '#C70039', fontFamily: "Myriad Pro"}}>{user.elo}</TableCell>
			<TableCell align="center">{user.victories}</TableCell>
			<TableCell align="center">{user.defeats}</TableCell>
			<TableCell align="center">{user.victories + user.defeats}</TableCell>
		</TableRow>
		<TableRow>
			<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<Box sx={{ margin: 1 }}>
				<Typography variant="h6" gutterBottom component="div">
					<p style={{fontFamily: 'Myriad Pro'}}>Historique Matchs</p>
				</Typography>
				<Table size="small" aria-label="purchases">
					<TableHead>
					<TableRow>
						<TableCell align="center" sx={{fontFamily: 'Myriad Pro', fontSize: "17px"}}>Login</TableCell>
						<TableCell align="center" sx={{fontFamily: 'Myriad Pro', fontSize: "17px"}}>Score 1</TableCell>
						<TableCell align="center" sx={{fontFamily: 'Myriad Pro', fontSize: "17px"}}></TableCell>
						<TableCell align="center" sx={{fontFamily: 'Myriad Pro', fontSize: "17px"}}>Score 2</TableCell>
						<TableCell align="center" sx={{fontFamily: 'Myriad Pro', fontSize: "17px"}}>Login</TableCell>
					</TableRow>
					</TableHead>
					<TableBody>
					{matchs.map((match) => (
						<TableRow key={match.id}>
						<TableCell component="th" scope="row" align="center">{match.player_1_login}</TableCell>
						<TableCell align="center" sx={{color: match.player_1_score > match.player_2_score ? "green" : match.player_1_score < match.player_2_score ? "#C70039" : "black"}}>{match.player_1_score}</TableCell>
						<TableCell align="center" sx={{fontFamily: 'Myriad Pro', fontSize: "27px", alignContent: "center"}}>-</TableCell>
						<TableCell align="center" sx={{color: match.player_2_score > match.player_1_score ? "green" : match.player_2_score < match.player_1_score ? "#C70039" : "black"}}>{match.player_2_score}</TableCell>
						<TableCell align="center">{match.player_2_login}</TableCell>
						</TableRow>
					))}
					</TableBody>
				</Table>
				</Box>
				{error !== "" ?
					<MySnackBar message={`${error}`} severity="error" time={10000}/> :
					<MySnackBar message={`Données matchs ${user.login} chargées`} severity="success" time={2000}/>
				}
			</Collapse>
			</TableCell>
		</TableRow>
		</React.Fragment>
	);
}

export default function MyLadder(props: {me: User}) {

	const [users, setUsers] = useState<User[]>([]);
	const [error, setError] = useState<unknown>("");
	const { me } = props;

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${api}${apiLadder}`);
				setUsers(response.data);
			}
			catch (err) {
				setError(err);
			}
		}
		fetchUsers();
	}, []);

	// eslint-disable-next-line eqeqeq
	if (users == undefined && error === "")
		return (<MyChargingDataAlert />);
	else if (error !== "")
		return (<MyError error={error}/>);
	return (
		<Stack sx={{backgroundColor: "white", width: 1, height: 0.82, borderRadius: 5}} direction="column">
			<TableContainer>
				<Table aria-label="collapsible table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell><p style={{fontFamily: "Myriad Pro", fontSize:"21px"}}>Classement</p></TableCell>
							<TableCell align="center" sx={{fontFamily: "Myriad Pro"}}>Elo</TableCell>
							<TableCell align="center" sx={{fontFamily: "Myriad Pro"}}>Victoires</TableCell>
							<TableCell align="center" sx={{fontFamily: "Myriad Pro"}}>Défaites</TableCell>
							<TableCell align="center" sx={{fontFamily: "Myriad Pro"}}>Total</TableCell>
							<TableCell align="center" sx={{fontFamily: "Myriad Pro"}}></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
						<Row key={user.id} user={user} me={me}/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<MySnackBar message={`Données classement chargées`} severity="success" time={2000}/>
		</Stack>
	);
}
