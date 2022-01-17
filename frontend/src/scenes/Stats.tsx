import { Button, ButtonGroup, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MyAchievements from '../components/MyAchievements';
import MyHistory from '../components/MyHistory';
import { api, apiMe, apiStats, apiUsers } from '../services/Api/Api';
import { Friends, User } from '../services/Interface/Interface';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import MyAvatar from '../components/MyAvatar';
import MyChargingDataAlert from '../components/MyChargingDataAlert';
import MyError from '../components/MyError';
import MySnackBar from '../components/MySnackbar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Stats = () => {
	const { login } = useParams();

	const [user, setUser] = useState<User>();
	const [me, setMe] = useState<User>();
	const [error, setError] = useState<unknown>("");
	const [successAdd, setSuccessAdd] = useState<boolean>(false);
	const [successDelete, setSuccessDelete] = useState<boolean>(false);
	const [friends, setFriends] = useState<Friends[]>([]);
	const [friendsPending, setFriendsPending] = useState<Friends[]>([]);

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

	useEffect(() => {
		const fetchFriendsMe = async () => {
			try {
				const url = `http://127.0.0.1/api/profile/friends`;
				const reponse = await axios.get(url);
				setFriends(reponse.data);
			} catch (err) {
				setError(err);
			}
		}
		fetchFriendsMe();
	}, [successAdd, successDelete])

	useEffect(() => {
		const fetchFriendsMePending = async () => {
			try {
				const url = `http://127.0.0.1/api/profile/friends/pending`;
				const reponse = await axios.get(url);
				setFriendsPending(reponse.data);
			} catch (err) {
				setError(err);
			}
		}
		fetchFriendsMePending();
	}, [successDelete, successAdd])

	async function handleAddFriend() {
		try {
			await axios.post(`${api}${apiUsers}/${login}/friend`)
			setSuccessDelete(false);
			setSuccessAdd(true);
		}
		catch (err) {
			setError(err);
		}
	}

	async function handleDeleteFriend() {
		try {
			await axios.delete(`${api}${apiUsers}/${login}/friend`)
			setSuccessAdd(false);
			setSuccessDelete(true);
		}
		catch (err) {
			setError(err);
		}
	}

	// eslint-disable-next-line eqeqeq
	if ((me == undefined || user == undefined || friends == undefined || friendsPending == undefined) && error === "")
		return (<MyChargingDataAlert />);
	// eslint-disable-next-line eqeqeq
	else if (error !== "" || user == undefined || me == undefined)
		return (<MyError error={error}/>);
	const isFriend = friends.filter(function (friend) {
		return friend.user_login === user?.login
	});
	const isFriendPending = friendsPending.filter(function (friendPending) {
		return friendPending.friend_login === user?.login
	});
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
					{user.login !== me.login ?
					<Box>
						{isFriend.length === 0 && isFriendPending.length === 0 ?
							<Button onClick={() => handleAddFriend()} sx={{borderRadius: 2, marginRight: "30px"}} variant="contained" startIcon={<PersonAddIcon />}>
								<div style={{margin: "5px", padding: "3px", fontFamily: "Myriad Pro", fontSize: "16px"}}>Add friend</div>
							</Button> : isFriendPending.length !== 0 && isFriend.length === 0 ? 
							<ButtonGroup>
								<Button disabled sx={{borderRadius: 2, marginRight: "30px"}} variant="contained" startIcon={<AccessTimeIcon />}>
									<div style={{margin: "5px", padding: "3px", fontFamily: "Myriad Pro", fontSize: "16px"}}>Pending</div>
								</Button> 
								<Button onClick={() => handleDeleteFriend()} sx={{borderRadius: 2, marginRight: "30px"}} variant="contained" startIcon={<DeleteIcon />}>
									<div style={{margin: "5px", padding: "3px", fontFamily: "Myriad Pro", fontSize: "16px"}}>Delete friend</div>
								</Button>
							</ButtonGroup> :
							<Button onClick={() => handleDeleteFriend()} sx={{borderRadius: 2, marginRight: "30px"}} variant="contained" startIcon={<DeleteIcon />}>
								<div style={{margin: "5px", padding: "3px", fontFamily: "Myriad Pro", fontSize: "16px"}}>Delete friend</div>
							</Button>
						}
					</Box> : null
					}
				</Stack>
				<MyHistory user={user}/>
			</Stack>
			{error !== "" ? <MySnackBar message={`${error}`} severity="error" time={2000}/> : successAdd === true ?
			<MySnackBar message={`Demande d'ami envoyée`} severity="success" time={2000}/> : successDelete === true ? 
			<MySnackBar message={`Suppression ami recu`} severity="success" time={2000}/> : null
			}
		</Stack>
	);
}

export default Stats;