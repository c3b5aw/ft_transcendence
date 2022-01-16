import { Button, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MyAchievements from '../components/MyAchievements';
import MyHistory from '../components/MyHistory';
import { api, apiMe, apiStats } from '../services/Api/Api';
import { User } from '../services/Interface/Interface';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import MyAvatar from '../components/MyAvatar';
import MyChargingDataAlert from '../components/MyChargingDataAlert';
import MyError from '../components/MyError';

const Stats = () => {
	const { login } = useParams();

	const [user, setUser] = useState<User>();
	const [me, setMe] = useState<User>();
	const [error, setError] = useState<unknown>("");

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
	}, [login])

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const url = `http://127.0.0.1/api/users/${login}${apiStats}`;
				const reponse = await axios.get(url);
				setUser(reponse.data);
			} catch (err) {
				setError(err);
			}
		}
		fetchUser();
	}, [login, me])

	// eslint-disable-next-line eqeqeq
	if ((me == undefined || user == undefined) && error === "")
		return (<MyChargingDataAlert />);
	else if (error !== "" || user == undefined)
		return (<MyError error={error}/>);
	return (
		<Stack sx={{width: 1, height: 1}} direction="row" spacing={3}>
			<Stack sx={{ width: 0.2, height: "100vh" }} direction="column" alignItems="center">
				<MyAvatar user={user}/>
				<Stack sx={{ width: 1, height: 1/4, marginLeft: "30%" }} direction="column" justifyContent="center" spacing={4}>
					<h2>Matchs joués : {user.played}</h2>
					<h2>Classement : {user.rank}</h2>
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
		</Stack>
	);
}

export default Stats;