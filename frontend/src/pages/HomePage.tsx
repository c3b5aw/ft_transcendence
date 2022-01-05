import { Paper } from '@material-ui/core';
import * as React from 'react';
import { useState } from 'react';
import SearchBar from "material-ui-search-bar";
import { makeStyles } from '@mui/styles';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import { StyleH1 } from '../styles/Styles';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

interface user {
  username: string;
}

const useStyles = makeStyles({
	stack: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	paper: {
		width: '50%',
		borderRadius: 15,
		marginTop: "5rem",
	},
	searchBar: {
		borderRadius: 10,
	},
	rootButton: {
		background: "#C70039",
	},
	button: {
		variant: "contained"
	},
});

const originalRows: user[] = [
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "eoliveir" },
	{ username: "sbeaujar" },
	{ username: "nbascaul" },
	{ username: "ebauer" },
	{ username: "hdeforet" },
	{ username: "lroussel" },
	{ username: "dgigoule" }
];

export function Footer() {
	const navigate = useNavigate();

	function handleLaunchStats() {
		navigate('/stats');
	}

	function handleLaunchClassement() {
		navigate('/classement');
	}

	function handleLaunchParametres() {
		navigate('/parametres');
	}
	return (
		<Stack
			display="flex"
			direction={{ xs: 'column', sm: 'row' }}
        	spacing={{ xs: 8, sm: 16, md: 24 }}
			justifyContent="center"
		>
			<Button sx={{
				background: 'white',
				color: '#000000',
				'&:hover': {
					backgroundColor: '#D5D5D5',
					color: '#000000',
				},
				width: '18%',
				minHeight: '21%',
				borderRadius: 5,
				border: 5,
			}}
				onClick={() => handleLaunchStats()}>
				<h2>Statistiques</h2>
			</Button>
			<Button sx={{
				background: 'white',
				color: '#000000',
				'&:hover': {
					backgroundColor: '#D5D5D5',
					color: '#000000',
				},
				width: '18%',
				minHeight: '21%',
				borderRadius: 5,
				border: 5,
			}}
				onClick={() => handleLaunchClassement()}>
				<h2>Classement</h2>
			</Button>
			<Button sx={{
				background: 'white',
				color: '#000000',
				'&:hover': {
					backgroundColor: '#D5D5D5',
					color: '#000000',
				},
				width: '18%',
				minHeight: '21%',
				borderRadius: 5,
				border: 5,
			}}
				onClick={() => handleLaunchParametres()}>
				<h2>Paramètres</h2>
			</Button>
		</Stack>
	);
};

export default function HomePage() {
	const emptyUser: user[] = Array(0);
	const [rows, setRows] = useState<user[]>(emptyUser);
	const [searched, setSearched] = useState<string>("");
	const classes = useStyles();
	const styleH1 = StyleH1();
	const navigate = useNavigate();

	const requestSearch = (searchedVal: string) => {
		if (searchedVal === "") {
			setRows(emptyUser);
		}
		else {
			const filteredRows = originalRows.filter((row) => {
				return row.username.toLowerCase().startsWith(searchedVal.toLowerCase());
			});
			setRows(filteredRows);
		}
	};

	const cancelSearch = () => {
		setSearched("");
		requestSearch(searched);
	};

	function handleClickCell(username: string) {
		navigate('/' + username);
	}

	function handleLaunchGame() {
		navigate('/game');
	}

	return (
		<Stack direction="row">
			<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '80%'
			}}>
				<Stack className={classes.stack} spacing={{ xs: 8, sm: 16, md: 24 }}>
					<Paper className={classes.paper}>
						<SearchBar className={classes.searchBar}
							placeholder="Search friends..."
							value={searched}
							onChange={(searchVal) => requestSearch(searchVal)}
							onCancelSearch={() => cancelSearch()}
							cancelOnEscape={true}
						/>
						<Paper className={classes.paper} style={{top: "2.7rem", position: 'absolute', width: '40%'}}>
						<TableContainer sx={{maxHeight: 200}}>
							<Table>
								<TableBody>
									{rows.map((row) => (
									<TableRow key={row.username} hover>
										<TableCell component="th" scope="row" onClick={() => handleClickCell(row.username)}>
											{row.username}
										</TableCell>
									</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
					</Paper>
					<h1 className={styleH1.root} style={{marginTop: "7rem"}}>ft_transcendance</h1>
					<Button sx={{
						background: 'white',
						color: '#000000',
						'&:hover': {
							backgroundColor: '#D5D5D5',
							color: '#000000',
						},
						width: '18%',
						minHeight: '21%',
						borderRadius: 5,
						border: 5,
					}}
						onClick={() => handleLaunchGame()}>
						<h1>Start Game</h1></Button>
				</Stack>
				<Box component="footer" sx={{py: 15, mt: 'auto'}}>
					<Container maxWidth="lg">
						<Footer />
					</Container>
				</Box>
			</Box>
			<Box sx={{backgroundColor: "cyan", minWidth: "20%", minHeight: "100%"}}>
				Hello2
			</Box>
		</Stack>
	);
}