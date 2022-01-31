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
import { api, apiLadder, apiMatch, apiStats, apiUsers } from "../../../Services/Api/Api";
import { useEffect, useState } from 'react';
import { Match, User } from '../../../Services/Interface/Interface';
import { Stack } from '@mui/material';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import { useSnackbar } from 'notistack'

function Row(props: { user: User, me: User}) {
	const [open, setOpen] = React.useState(false);
	const [matchs, setMatchs] = React.useState<Match[]>([]);
	const { enqueueSnackbar } = useSnackbar();
	const { user } = props;
	const { me } = props;
	const navigate = useNavigate();
	
	useEffect(() => {
		const fetchMatchs = async () => {
			try {
				if (user) {
					const reponse = await axios.get(`${api}${apiUsers}/${user.login}${apiMatch}`);
					setMatchs(reponse.data);
				}
			} catch (err) {
				enqueueSnackbar(`Impossible de charger l'historique des matchs de ${user.login} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		if (open && me !== undefined)
			fetchMatchs();
	}, [user, open, me, enqueueSnackbar])

	return (
		<React.Fragment>
		<TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: user.login === me?.login ? 'orange' : 'white' }}>
			<TableCell>
			<IconButton
				aria-label="expand row"
				size="small"
				onClick={() => setOpen(!open)}>
				{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
			</IconButton>
			</TableCell>
			<TableCell onClick={() => navigate(`${apiStats}/${user.login}`)} component="th" scope="row">
				<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>{user.login}</Typography>
			</TableCell>
			<TableCell align="center" sx={{color: '#C70039'}}>
				<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>{user.elo}</Typography>
			</TableCell>
			<TableCell align="center">
				<Typography variant="h6">{user.victories}</Typography>
			</TableCell>
			<TableCell align="center">
				<Typography variant="h6">{user.defeats}</Typography>
			</TableCell>
			<TableCell align="center">
				<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>{user.victories + user.defeats}</Typography>
			</TableCell>
		</TableRow>
		<TableRow>
			<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<Box sx={{ margin: 1 }}>
				<Typography variant="h6" gutterBottom component="div">
					<p style={{fontFamily: 'Myriad Pro', fontSize:"19px"}}>Historique Matchs</p>
				</Typography>
				<Table size="small" aria-label="purchases">
					<TableHead>
					<TableRow>
						<TableCell align="center">
							<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Login</Typography>
						</TableCell>
						<TableCell align="center">
							<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Score 1</Typography>
						</TableCell>
						<TableCell align="center"></TableCell>
						<TableCell align="center">
							<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Score 2</Typography>
						</TableCell>
						<TableCell align="center">
							<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Login</Typography>
						</TableCell>
					</TableRow>
					</TableHead>
					<TableBody>
					{matchs.map((match) => (
						<TableRow key={match.id}>
						<TableCell component="th" scope="row" align="center">
							<Typography variant="h6">{match.player1_login}</Typography>
						</TableCell>
						<TableCell align="center">
							<Typography variant="h6" style={{color: match.player1_score > match.player2_score ? "green" : match.player1_score < match.player2_score ? "#C70039" : "black"}}>{match.player1_score}</Typography>
						</TableCell>
						<TableCell align="center">
							<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>-</Typography>
						</TableCell>
						<TableCell align="center">
							<Typography variant="h6" style={{color: match.player2_score > match.player1_score ? "green" : match.player2_score < match.player1_score ? "#C70039" : "black", fontFamily: "Myriad Pro"}}>{match.player2_score}</Typography>
						</TableCell>
						<TableCell align="center">
							<Typography variant="h6">{match.player2_login}</Typography>
						</TableCell>
						</TableRow>
					))}
					</TableBody>
				</Table>
				</Box>
			</Collapse>
			</TableCell>
		</TableRow>
		</React.Fragment>
	);
}

export default function MyLadder(props: {me: User}) {

	const [users, setUsers] = useState<User[]>([]);
	const { enqueueSnackbar } = useSnackbar();
	const { me } = props;

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${api}${apiLadder}`);
				setUsers(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de charger le classement (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchUsers();
	}, [enqueueSnackbar]);

	if (users === undefined)
		return (<MyChargingDataAlert />);
	return (
		<Stack sx={{backgroundColor: "white", width: 0.95, minHeight:"auto", borderRadius: 5}} direction="column">
			<TableContainer>
				<Table aria-label="collapsible table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell>
								<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Login</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Elo</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Victoires</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Défaites</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Total</Typography>
							</TableCell>
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
