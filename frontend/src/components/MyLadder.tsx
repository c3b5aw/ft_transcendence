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
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { api, apiLadder, apiUsers } from "../services/Api/Api";
import { useEffect, useState } from 'react';
import { Match, User } from '../services/Interface/Interface';

function Row(props: { row: User }) {
  	const [open, setOpen] = React.useState(false);
  	const [matchs, setMatchs] = React.useState<Match[]>([]);
	const { row } = props;
	const navigate = useNavigate();
	
	useEffect(() => {
		const fetchMatchs = async () => {
			try {
				if (row)
				{
					const reponse = await axios.get(`${api}${apiLadder}`);
					setMatchs(reponse.data);
				}
			} catch (err) {
				console.log(err);
			}
		}
		if (open)
			fetchMatchs();
	}, [row, open])

  return (
	<React.Fragment>
	  <TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: row.display_name === 'Elie Oliveira' ? 'orange' : 'white' }}>
		<TableCell>
		  <IconButton
			aria-label="expand row"
			size="small"
			onClick={() => setOpen(!open)}
		  >
			{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
		  </IconButton>
		</TableCell>
		<TableCell onClick={() => navigate(`${api}${apiUsers}/${row.id}`)} component="th" scope="row">{row.display_name}</TableCell>
		<TableCell align="center" sx={{color: '#C70039', fontFamily: "Myriad Pro"}}>{row.elo}</TableCell>
		<TableCell align="center">{row.victories}</TableCell>
		<TableCell align="center">{row.defeats}</TableCell>
		<TableCell align="center">{row.victories + row.defeats}</TableCell>
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
					  <TableCell component="th" scope="row" align="center">{match.loginAdversaireOne}</TableCell>
					  <TableCell align="center" sx={{color: match.scoreOne > match.scoreTwo ? "green" : match.scoreOne < match.scoreTwo ? "#C70039" : "black"}}>{match.scoreOne}</TableCell>
					  <TableCell align="center" sx={{fontFamily: 'Myriad Pro', fontSize: "27px", alignContent: "center"}}>-</TableCell>
					  <TableCell align="center" sx={{color: match.scoreTwo > match.scoreOne ? "green" : match.scoreTwo < match.scoreOne ? "#C70039" : "black"}}>{match.scoreTwo}</TableCell>
					  <TableCell align="center">{match.loginAdversaireTwo}</TableCell>
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

export default function MyLadder() {

	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await axios.get(`${api}${apiLadder}`);
			setUsers(response.data);
		}
		fetchUsers();
	}, []);

	return (
	<TableContainer component={Paper}>
		<Table aria-label="collapsible table">
		<TableHead>
			<TableRow>
			<TableCell />
			<TableCell><p style={{fontFamily: "Myriad Pro", fontSize:"21px"}}>Classement</p></TableCell>
			<TableCell align="center" sx={{fontFamily: "Myriad Pro"}}>Place</TableCell>
			<TableCell align="center" sx={{fontFamily: "Myriad Pro"}}>Victoires</TableCell>
			<TableCell align="center" sx={{fontFamily: "Myriad Pro"}}>Défaites</TableCell>
			<TableCell align="center" sx={{fontFamily: "Myriad Pro"}}>Total</TableCell>
			<TableCell align="center" sx={{fontFamily: "Myriad Pro"}}></TableCell>
			</TableRow>
		</TableHead>
		<TableBody>
			{users.map((user) => (
			<Row key={user.id} row={user} />
			))}
		</TableBody>
		</Table>
	</TableContainer>
	);
}
