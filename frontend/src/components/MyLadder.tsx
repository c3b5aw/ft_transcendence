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
import { MatchsPropsTest, UserProps } from '../utils/Interface';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { api, apiUsers } from '../utils/Api';

function Row(props: { row: UserProps }) {
  	const [open, setOpen] = React.useState(false);
  	const [matchs, setMatchs] = React.useState<MatchsPropsTest[]>([]);
	const { row } = props;
	const navigate = useNavigate();

	React.useEffect(() => {
		const fetchMatchs = async () => {
			try {
				if (row)
				{
					const len = row.login.length + 39;
					const following_url = row.following_url.substring(0, len);
					const reponse = await axios.get(`${following_url}`);
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
	  <TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: row.login === 'lukas' ? 'orange' : 'white' }}>
		<TableCell>
		  <IconButton
			aria-label="expand row"
			size="small"
			onClick={() => setOpen(!open)}
		  >
			{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
		  </IconButton>
		</TableCell>
		<TableCell onClick={() => navigate(`${api}${apiUsers}/${row.login}`)} component="th" scope="row">{row.login}</TableCell>
		<TableCell align="center" sx={{color: '#C70039', fontFamily: "Myriad Pro"}}>{row.id}</TableCell>
		<TableCell align="center">{row.id}</TableCell>
		<TableCell align="center">{row.id}</TableCell>
		<TableCell align="center">{row.id}</TableCell>
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
					  <TableCell component="th" scope="row" align="center">{match.login}</TableCell>
					  <TableCell align="center" sx={{color: match.id > (match.id + 1) ? "green" : match.id < (match.id + 1) ? "#C70039" : "black"}}>{match.id}</TableCell>
					  <TableCell align="center" sx={{fontFamily: 'Myriad Pro', fontSize: "27px", alignContent: "center"}}>-</TableCell>
					  <TableCell align="center" sx={{color: (match.id + 1) > (match.id) ? "green" : (match.id + 1) < match.id ? "#C70039" : "black"}}>{match.id}</TableCell>
					  <TableCell align="center">{match.login}</TableCell>
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

export default function MyLadder(props: { rows: UserProps[] }) {
  const { rows } = props;
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
		  {rows.map((row) => (
			<Row key={row.id} row={row} />
		  ))}
		</TableBody>
	  </Table>
	</TableContainer>
  );
}

function navigate(arg0: string): void {
	throw new Error('Function not implemented.');
}
