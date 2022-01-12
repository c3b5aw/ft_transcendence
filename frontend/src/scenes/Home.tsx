import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { api, apiMe, apiUsers, usersApi } from '../services/Api/Api';
import MyFooter from '../components/MyFooter';
import { boxStyle, StyleH1, useStyles } from '../styles/Styles';
import { User } from '../services/Interface/Interface';
import MySearchBar from '../components/MySearchBar';

export default function Home() {
	const [checked, setChecked] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [me, setMe] = useState<User>();

	const classes = useStyles();
	const styleH1 = StyleH1();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiUsers}${apiMe}`);
				console.log(reponse.data);
				setMe(reponse.data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchMe();
	}, [])

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const reponse = await axios.get(`${usersApi}`);
				setUsers(reponse.data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchUsers();
	}, [])

	const handleChange = () => {
		setChecked(!checked);
	};

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
					<MySearchBar users={users}/>
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
					<MyFooter me={me}/>
				</Box>
				</Stack>
				{/* {ManageChat(checked, users)} */}
				{/* <Box sx={{ minWidth: "20%", minHeight: "100%"}}>
					<Fade in={checked}>{MyListFriends(users)}</Fade>
				</Box> */}
				{checked ?
					<Box sx={{ minWidth: "20%", minHeight: "100%"}}>
						{/* <MyListFriends items={users}/> */}
					</Box>
				: null}
		 </Stack>
	);
}