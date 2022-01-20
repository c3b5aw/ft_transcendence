import { Button, ButtonGroup, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MyAchievements from '../Components/MyAchievements';
import MyHistory from '../Components/MyHistory';
import { api, apiUsers } from '../../../services/Api/Api';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import MyAvatar from '../../../components/MyAvatar';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useMe from '../../../services/Hooks/useMe';
import useUserStats from '../Services/useUserStats';
import { sxButton, sxDiv } from '../Services/style';
import { Friends, STATUS } from '../../../services/Interface/Interface';
import { useSnackbar } from 'notistack'

const Stats = () => {
	const { login } = useParams();
	const { enqueueSnackbar } = useSnackbar();

	const user = useUserStats(login);
	const me = useMe();
	const [successAdd, setSuccessAdd] = useState<boolean>(false);
	const [successDelete, setSuccessDelete] = useState<boolean>(false);
	const [friends, setFriends] = useState<Friends[]>([]);
	const [friendsPending, setFriendsPending] = useState<Friends[]>([]);

	useEffect(() => {
		const fetchFriendsMe = async () => {
			try {
				const url = `http://127.0.0.1/api/profile/friends`;
				const reponse = await axios.get(url);
				setFriends(reponse.data);
			} catch (err) {
				enqueueSnackbar(`${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchFriendsMe();
	}, [enqueueSnackbar, successAdd, successDelete])

	useEffect(() => {
		const fetchFriendsMePending = async () => {
			try {
				const url = `http://127.0.0.1/api/profile/friends/pending`;
				const reponse = await axios.get(url);
				setFriendsPending(reponse.data);
			} catch (err) {
				enqueueSnackbar(`${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchFriendsMePending();
	}, [successDelete, successAdd, enqueueSnackbar])

	async function handleAddFriend() {
		try {
			await axios.put(`${api}${apiUsers}/${login}/friend`)
			enqueueSnackbar(`Demande d'ami envoyé à ${login}`, { 
				variant: 'success',
				autoHideDuration: 3000,
			});
			setSuccessDelete(false);
			setSuccessAdd(true);
		}
		catch (err) {
			enqueueSnackbar(`Impossible de demander en ami ${login} (${err})`, { 
				variant: 'error',
				autoHideDuration: 3000,
			});
		}
	}

	async function handleDeleteFriend() {
		try {
			await axios.delete(`${api}${apiUsers}/${login}/friend`)
			enqueueSnackbar(`${login} ne fait plus parti de vos amis`, { 
				variant: 'success',
				autoHideDuration: 3000,
			});
			setSuccessAdd(false);
			setSuccessDelete(true);
		}
		catch (err) {
			enqueueSnackbar(`Impossible de supprimer ${login} de vos amis (${err})`, { 
				variant: 'error',
				autoHideDuration: 3000,
			});
		}
	}

	if ((me === undefined || user === undefined || friends === undefined || friendsPending === undefined))
		return (<MyChargingDataAlert />);
	const isFriend = friends.filter(function (friend) {
		return (friend.status === STATUS.ACCEPTED && friend.login === user?.login);
	});
	const isFriendPending = friendsPending.filter(function (friendPending) {
		return (friendPending.status === STATUS.PENDING && friendPending.login === user?.login);
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
							<Button onClick={() => handleAddFriend()} sx={sxButton} variant="contained" startIcon={<PersonAddIcon />}>
								<div style={sxDiv}>Add friend</div>
							</Button> : isFriendPending.length !== 0 && isFriend.length === 0 ? 
							<ButtonGroup>
								<Button disabled sx={sxButton} variant="contained" startIcon={<AccessTimeIcon />}>
									<div style={sxDiv}>Pending</div>
								</Button> 
								<Button onClick={() => handleDeleteFriend()} sx={sxButton} variant="contained" startIcon={<DeleteIcon />}>
									<div style={sxDiv}>Delete friend</div>
								</Button>
							</ButtonGroup> :
							<Button onClick={() => handleDeleteFriend()} sx={sxButton} variant="contained" startIcon={<DeleteIcon />}>
								<div style={sxDiv}>Delete friend</div>
							</Button>
						}
					</Box> : null
					}
				</Stack>
				<MyHistory user={user}/>
			</Stack>
		</Stack>
	);
}

export default Stats;