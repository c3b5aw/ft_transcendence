import { Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MyAchievements from '../Components/MyAchievements';
import MyHistory from '../Components/MyHistory';
import { api, apiChannel, apiChat, apiDM, apiUsers } from '../../../Services/Api/Api';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import MyAvatar from '../../../components/MyAvatar';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useMe from '../../../Services/Hooks/useMe';
import useUserStats from '../Services/useUserStats';
import { sxButton } from '../Services/style';
import { Friends } from '../../../Services/Interface/Interface';
import { useSnackbar } from 'notistack'
import MessageIcon from '@mui/icons-material/Message';
import MyFooter from '../../../components/MyFooter';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const Stats = () => {
	const { login } = useParams();
	const { enqueueSnackbar } = useSnackbar();

	const user = useUserStats(login);
	const me = useMe();
	const [successAdd, setSuccessAdd] = useState<boolean>(false);
	const [successDelete, setSuccessDelete] = useState<boolean>(false);
	const [friends, setFriends] = useState<Friends[]>([]);
	const [friendsPending, setFriendsPending] = useState<Friends[]>([]);
	const navigate = useNavigate();

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
				autoHideDuration: 2000,
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

	async function handleSendMessage() {
		if (login !== undefined) {
			try {
				await axios.post(`${api}${apiChannel}${apiDM}`, {
					login: login,
				})
				navigate(`${apiChat}`)
			}
			catch (err) {
				enqueueSnackbar(`Impossible d'envoyer un message à ${login} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
	}

	const handleSendDuelGame = () => {
		console.log("send duel game");
	}

	if ((me === undefined || user === undefined || friends === undefined || friendsPending === undefined))
		return (<MyChargingDataAlert />);
	const isFriend = friends.filter(function (friend) {
		return (friend.login === user.login);
	});
	const isFriendPending = friendsPending.filter(function (friendPending) {
		return (friendPending.login === user.login);
	});
	return (
		<Stack direction="column">
			<MyFooter me={me}/>
			<div style={{marginTop: 10}} />
			<Stack
				sx={{width: 1, height: "93%"}}
				direction="row"
				spacing={3}
			>
				<Stack
					sx={{ width: {xs: 0.50, sm: 0.40, md: 0.30, lg: 0.2}, marginLeft: "1%" }}
					direction="column"
					spacing={3}
				>
					<MyAvatar user={user}/>
					<div style={{marginTop: "25%"}}></div>
					{user.login !== me.login ?
						<Button
							onClick={() => handleSendMessage()}
							sx={sxButton} variant="contained"
							startIcon={<MessageIcon />}
						>
							<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Send message</Typography>
						</Button> : null
					}
					{user.login !== me.login && isFriend.length > 0 ?
						<Button
							onClick={() => handleSendDuelGame()}
							sx={sxButton} variant="contained"
							startIcon={<SportsEsportsIcon />}
						>
							<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Duel</Typography>
						</Button> : null
					}
					<Typography variant="h5" style={{fontFamily: "Myriad Pro", textAlign: "center"}}>Matchs joués : {user.played}</Typography>
					<Typography variant="h5" style={{fontFamily: "Myriad Pro", textAlign: "center"}}>Classement : {user.rank}</Typography>
					<Typography variant="h5" style={{color: '#079200', fontFamily: "Myriad Pro", textAlign: "center"}}>Victoires : {user.victories}</Typography>
					<Typography variant="h5" style={{color: '#C70039', fontFamily: "Myriad Pro", textAlign: "center"}}>Défaites : {user.defeats}</Typography>
					<MyAchievements user={user}/>
				</Stack>
				<Stack	
					sx={{width: 0.775, height: "auto"}}
					direction="column"
					justifyContent="center"
					alignItems="center"
				>
					<Stack
						sx={{width: 1, height: 2/12}}
						direction="row"
						alignItems="flex-end"
						justifyContent="space-between"
						spacing={4}
					>
						<Typography variant="h4" style={{color: 'white', fontFamily: "Myriad Pro", textAlign: "center"}}>Historique</Typography>
						{user.login !== me.login ?
						<Stack direction={{xs: "column", sm: "column", md: "column", lg: "column"}}>
							{isFriend.length === 0 && isFriendPending.length === 0
								?
								<Button
									onClick={() => handleAddFriend()}
									sx={sxButton}
									variant="contained"
									startIcon={<PersonAddIcon />}
								>
									<Typography variant="h5" style={{color: 'white', fontFamily: "Myriad Pro", textAlign: "center"}}>Add friend</Typography>
								</Button>
								:
								isFriendPending.length !== 0 && isFriend.length === 0
								? 
								<Stack direction={{xs: "column", sm: "column", md: "column", lg: "row"}} spacing={3}>
									<Button
										disabled
										sx={sxButton}
										variant="contained"
										startIcon={<AccessTimeIcon />}
									>
										<Typography variant="h5" style={{color: 'white', fontFamily: "Myriad Pro", textAlign: "center"}}>Pending</Typography>
									</Button> 
									<Button
										onClick={() => handleDeleteFriend()}
										sx={sxButton} variant="contained"
										startIcon={<DeleteIcon />}
									>
										<Typography variant="h5" style={{color: 'white', fontFamily: "Myriad Pro", textAlign: "center"}}>Delete friend</Typography>
									</Button>
								</Stack> :
								<Button
									onClick={() => handleDeleteFriend()}
									sx={sxButton} variant="contained"
									startIcon={<DeleteIcon />}
								>
									<Typography variant="h5" style={{color: 'white', fontFamily: "Myriad Pro", textAlign: "center"}}>Delete friend</Typography>
								</Button>
							}
						</Stack> : null
						}
					</Stack>
					<MyHistory user={user}/>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default Stats;