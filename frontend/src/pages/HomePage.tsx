import { Paper } from '@material-ui/core';
import { useEffect, useState } from 'react';
import SearchBar from "material-ui-search-bar";
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import { boxStyle, StyleH1, useStyles } from '../styles/Styles';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { CircularProgress, Fade } from '@mui/material';
import MyFooter from '../components/MyFooter';
import axios from 'axios';
import { api, apiUsers, usersApi } from '../utils/Api';
import { UserProps } from '../utils/Interface';
import MyListFriends from '../components/MyListFriends';

// export function ManageChat(checked: boolean, users: UserProps[]) {
// 	//marginRight: "20px", marginTop: "20px", marginBottom: "20px"
// 	if (checked)
// 	{
// 		return (
// 			<Box sx={{ minWidth: "20%", minHeight: "100%"}}>
// 				<Fade in={checked}>{MyListFriends(users)}</Fade>
// 			</Box>
// 		);
// 	}
// }

export default function HomePage() {
	const [rows, setRows] = useState<UserProps[]>([]);
	const [searched, setSearched] = useState<string>("");
	const [checked, setChecked] = useState(false);
	const [users, setUsers] = useState<UserProps[]>([]);
	const [test, setTest] = useState<boolean>(false);

	const classes = useStyles();
	const styleH1 = StyleH1();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const reponse = await axios.get(`${usersApi}`);
				setUsers(reponse.data);
				// setTest(true);
			} catch (err) {
				console.log(err);
			}
		}
		fetchUsers();
	}, [])

	const requestSearch = (searchedVal: string) => {
		if (searchedVal === "") {
			setRows([]);
		}
		else {
			const filteredResults = users.filter((row) =>
				((row.login).toLowerCase()).startsWith(searchedVal.toLowerCase()));
			setRows(filteredResults);
		}
	};

	const handleChange = () => {
		setChecked(!checked);
	};

	const cancelSearch = () => {
		setSearched("");
		requestSearch(searched);
	};

	function handleClickCell(username: string) {
		navigate(`${api}${apiUsers}/${username}`);
	}

	function handleLaunchGame() {
		navigate('/game');
	}

	// eslint-disable-next-line eqeqeq
	if (users == undefined) {
		return (
			<Stack sx={{width: 1, height: "100vh"}} direction="row" alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}
	return (
		<Stack direction="row" sx={{width: 1, minHeight: "100vh"}}>
			<Stack direction="column" sx={{width: 1}}>
				<FormControlLabel
					sx={{marginLeft: "10px", marginTop: "5px"}}
					control={<Switch checked={checked}
					onChange={handleChange}
					/>}
					label="Show Chat"
				/>
				<Box className={classes.box} sx={boxStyle}>
					<Paper className={classes.paper}>
						<SearchBar className={classes.searchBar}
							placeholder="Search friends..."
							value={searched}
							onChange={(searchVal) => requestSearch(searchVal)}
							onCancelSearch={() => cancelSearch()}
							cancelOnEscape={true}
						/>
						<Paper className={classes.paper} style={{top: '17.5%', position: 'absolute', width: '40%'}}>
							<TableContainer sx={{maxHeight: 200}}>
								<Table>
									<TableBody>
										{rows.map((row) => (
										<TableRow key={row.login} hover>
											<TableCell component="th" scope="row" onClick={() => handleClickCell(row.login)}>
												{row.login}
											</TableCell>
										</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Paper>
					</Paper>
				</Box>
				<Box className={classes.box} sx={boxStyle}>
					<h1 className={styleH1.root}>ft_transcendance</h1>
				</Box>
				<Box className={classes.box} sx={boxStyle}>
					<Button sx={{
						background: 'white',
						color: '#000000',
						'&:hover': {
							backgroundColor: '#D5D5D5',
							color: '#000000',
						},
						width: '25%',
						borderRadius: 5,
						border: 5,
						fontSize: '20px',
					}}
						onClick={() => handleLaunchGame()}>
						<h1>Start Game</h1>
						</Button>
				</Box>
				<Box component="footer" sx={{ mt: 'auto', height: '25vh'}}>
					<MyFooter />
				</Box>
				</Stack>
				{/* {ManageChat(checked, users)} */}
				{/* <Box sx={{ minWidth: "20%", minHeight: "100%"}}>
					<Fade in={checked}>{MyListFriends(users)}</Fade>
				</Box> */}
				{checked ?
					<Box sx={{ minWidth: "20%", minHeight: "100%"}}>
						<MyListFriends items={users}/>
					</Box>
				: null}
		 </Stack>
	);
}