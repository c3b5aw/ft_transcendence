import { Avatar, Button, CircularProgress, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MyAchievements from '../components/MyAchievements';
import MyChat from '../components/MyChat';
import MyHistory from '../components/MyHistory';
import { api, apiMe } from '../services/Api/Api';
import { User } from '../services/Interface/Interface';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';

const Stats = () => {
	const { login } = useParams();

	const [user, setUser] = useState<User>();
	const [me, setMe] = useState<User>();

	// const testMessageList: MessageProps[] = [
	// 	{ message: "Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas", to:"tom" },
	// 	{ message: "12", to:"tom" },
	// 	{ message: "elie1", to:"elie" },
	// 	{ message: "14", to:"tom"},
	// 	{ message: "15", to:"tom" },
	// 	{ message: "elie2", to:"elie" },
	// 	{ message: "elie3", to:"elie" },
	// 	{ message: "elie4", to:"elie" },
	// 	{ message: "1u", to:"tom" },
	// 	{ message: "17u", to:"tom" },
	// 	{ message: "elie", to:"elie" },
	// 	{ message: "17grg", to:"tom" },
	// 	{ message: "elie6", to:"elie" },
	// 	{ message: "17qew", to:"tom" },
	// 	{ message: "Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas", to:"elie" },
	// 	{ message: "18de", to:"tom" },
	// 	{ message: "elie8", to:"elie" },
	// 	{ message: "elie9", to:"elie" },
	// 	{ message: "1rgffr", to:"tom" },
	// 	{ message: "17hhgrg", to:"tom" },
	// 	{ message: "elie10", to:"elie" },
	// 	{ message: "elie11", to:"elie" },
	// ];

	// const [messages] = useState<MessageProps[]>(testMessageList);

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchMe();
	}, [login])

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const url = `http://127.0.0.1/api/users/${login}`;
				const reponse = await axios.get(url);
				setUser(reponse.data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchUser();
	}, [login, me])

	// eslint-disable-next-line eqeqeq
	if (user == undefined) {
		return (
			<Stack sx={{width: 1, height: "100vh"}} direction="row" alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}
	return (
		<Stack sx={{width: 1, height: 1}} direction="row" spacing={3}>
			<Stack sx={{ width: 0.2, height: "100vh" }} direction="column" alignItems="center">
				<Stack sx={{ width: 1, height: 1/4 }} direction="column" alignItems="center" justifyContent="center" spacing={3}>
					<Avatar
						src={`http://127.0.0.1/api/users/${user.login}/avatar`}
						sx={{ width: "126px", height: "126px" }}>
					</Avatar>
					<h2>{user.login}</h2>
					<h3 style={{ color: 'grey' }}>Join le 03/01/2022</h3>
				</Stack>
				<Stack sx={{ width: 1, height: 1/4, marginLeft: "30%" }} direction="column" justifyContent="center" spacing={4}>
					<h2>Matchs joués : {user.played}</h2>
					<h2>Classement : {user.elo}</h2>
					<h2 style={{color: '#079200'}}>Victoires : {user.victories}</h2>
					<h2 style={{color: '#C70039'}}>Défaites : {user.defeats}</h2>
				</Stack>
				<MyAchievements user={user}/>
			</Stack>
			<Stack sx={{width: 0.775, height: "100vh"}} direction="column" justifyContent="center" alignItems="center">
				<Stack sx={{width: 1, height: 2/12}} direction="row" alignItems="flex-end" justifyContent="space-between" spacing={4}>
					<h1 style={{fontFamily: 'Myriad Pro'}}>Historique</h1>
					{user?.login !== me?.login ?
					<Box>
						<Button sx={{borderRadius: 2, marginRight: "30px"}} variant="contained" startIcon={<PersonAddIcon />}>
							<div style={{margin: "5px", padding: "3px", fontFamily: "Myriad Pro", fontSize: "16px"}}>Add friend</div>
						</Button>
						<Button sx={{borderRadius: 2, marginRight: "30px"}} variant="contained" startIcon={<DeleteIcon />}>
							<div style={{margin: "5px", padding: "3px", fontFamily: "Myriad Pro", fontSize: "16px"}}>Delete friend</div>
						</Button>
					</Box> : null
					}
				</Stack>
				<MyHistory user={user}/>
			</Stack>
			{user?.login !== me?.login ? <MyChat user={user}/> : null}
		</Stack>
	);
}

export default Stats;
// : <Stack sx={{width: 1, height: 2/12}} />