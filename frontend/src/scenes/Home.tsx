import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import axios from 'axios';
import { api, apiMe, apiUsers } from '../services/Api/Api';
import MyFooter from '../components/MyFooter';
import { boxStyle, StyleH1, useStyles } from '../styles/Styles';
import { User } from '../services/Interface/Interface';
import MySearchBar from '../components/MySearchBar';
import MyChargingDataAlert from '../components/MyChargingDataAlert';
import MyError from '../components/MyError';

export default function Home() {
	const [users, setUsers] = useState<User[]>([]);
	const [me, setMe] = useState<User>();
	const [error, setError] = useState<unknown>("");

	const classes = useStyles();
	const styleH1 = StyleH1();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
			} catch (err) {
				setError(err);
			}
		}
		fetchMe();
	}, [])

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const reponse = await axios.get(`${api}${apiUsers}`);
				setUsers(reponse.data);
			} catch (err) {
				setError(err);
			}
		}
		fetchUsers();
	}, [])

	function handleLaunchGame() {
		navigate('/game');
	}

	// eslint-disable-next-line eqeqeq
	if ((me == undefined || users == undefined) && error === "")
		return (<MyChargingDataAlert />);
	// eslint-disable-next-line eqeqeq
	else if (error !== "" || me == undefined)
		return (<MyError error={error}/>);
	return (
		<Stack direction="row" sx={{width: 1, minHeight: "100vh"}}>
			<Stack direction="column" sx={{width: 1}}>
				<Stack direction="column" sx={{width: 1, height: 0.85}}>
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
				</Stack>
				<Stack direction="row" sx={{width: 1, height: 0.08}}>
					<MyFooter me={me}/>
				</Stack>
				</Stack>
		 </Stack>
	);
}