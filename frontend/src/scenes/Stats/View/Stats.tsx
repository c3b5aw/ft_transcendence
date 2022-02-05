import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MyAchievements from '../Components/MyAchievements';
import MyHistory from '../Components/MyHistory';
import { api, apiChannel, apiChat, apiDM, apiGame, apiUsers } from '../../../Services/Api/Api';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import MyAvatar from '../../../components/MyAvatar';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useMe from '../../../Services/Hooks/useMe';
import useUserStats from '../Services/useUserStats';
import { Friend, PAGE, USER_STATUS } from '../../../Services/Interface/Interface';
import { useSnackbar } from 'notistack'
import MessageIcon from '@mui/icons-material/Message';
import MyFooter from '../../../components/MyFooter';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import { matchJoinDuel } from '../../Game/Services/wsGame';
import { MATCHTYPE } from '../../Game/Services/utils';
import PeopleIcon from '@mui/icons-material/People';
import MyRequestFriends from '../Components/MyRequestFriends';
import MySearchBar from '../../Home/Components/MySearchBar';
import useUsers from '../../../Services/Hooks/useUsers';

const Stats = () => {
	const { login } = useParams();
	const { enqueueSnackbar } = useSnackbar();

	const user = useUserStats(login);
	const me = useMe();
	const users = useUsers();
	const [successAdd, setSuccessAdd] = useState<boolean>(false);
	const [successDelete, setSuccessDelete] = useState<boolean>(false);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [friendsPending, setFriendsPending] = useState<Friend[]>([]);
	const navigate = useNavigate();
	const [openAchievements, setOpenAchievements] = useState<boolean>(false);
	const [openDemandeAmis, setOpenDemandeAmis] = useState<boolean>(false);

	useEffect(() => {
		const fetchFriendsMe = async () => {
			try {
				const url = `/api/profile/friends`;
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
				const url = `/api/profile/friends/pending`;
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

	const handleAchievementMenuClose = () => {
		setAchievementMoreAnchorEl(null);
	};

	const handleAchievementMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAchievementMoreAnchorEl(event.currentTarget);
	};

	const [AchievementMoreAnchorEl, setAchievementMoreAnchorEl] =
		React.useState<null | HTMLElement>(null);

	const isAchievementMenuOpen = Boolean(AchievementMoreAnchorEl);

	if ((me === undefined || user === undefined || users === undefined || friends === undefined || friendsPending === undefined))
		return (<MyChargingDataAlert />);
	const isFriend = friends.filter(function (friend) {
		return (friend.login === user.login);
	});
	const isFriendPending = friendsPending.filter(function (friendPending) {
		return (friendPending.login === user.login);
	});

	const handleSendDuelGame = () => {
		matchJoinDuel(MATCHTYPE.MATCH_DUEL, user.login);
		navigate(`${apiGame}/roomview`)
	}

	const renderAchievementMenu = (
		<Menu
			anchorEl={AchievementMoreAnchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			id="menu-achievements"
			keepMounted
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={isAchievementMenuOpen}
			onClose={handleAchievementMenuClose}
		>
			{user.login !== me.login ?
				<MenuItem onClick={handleSendMessage}>
					<IconButton>
						<MessageIcon />
					</IconButton>
					<p>Send message</p>
				</MenuItem> : null}
			{user.login !== me.login && isFriend.length > 0 && user.status === USER_STATUS.ONLINE ?
				<MenuItem onClick={handleSendDuelGame}>
					<IconButton>
						<SportsEsportsIcon />
					</IconButton>
					<p>Duel</p>
				</MenuItem> : null}
			<MenuItem onClick={() => setOpenAchievements(true)}>
				<IconButton>
					<EmojiEventsIcon />
				</IconButton>
				<p>Achievements</p>
			</MenuItem>
			{user.login === me.login ?
				<MenuItem onClick={() => setOpenDemandeAmis(true)}>
					<IconButton>
						<PeopleIcon />
					</IconButton>
					<p>Demandes d'amis</p>
				</MenuItem> : null}
			{user.login !== me.login && isFriend.length === 0 && isFriendPending.length === 0 ? //n'est pas ami et nest pas en pending
				<MenuItem onClick={() => handleAddFriend()}>
					<IconButton>
						<PersonAddIcon />
					</IconButton>
					<p>Demander en ami</p>
				</MenuItem> :
				<MenuItem onClick={() => handleDeleteFriend()}>
					<IconButton>
						{user.login !== me.login && isFriendPending.length !== 0 && isFriend.length === 0 ?
							<AccessTimeIcon /> : <DeleteIcon />}
					</IconButton>
					{user.login !== me.login && isFriendPending.length !== 0 && isFriend.length === 0 ?
						<p>Demande d'ami envoyée</p> : <p>Supprimer de la liste d'amis</p>}
				</MenuItem>}
		</Menu>
	);

	return (
		<Stack direction="column" spacing={7} alignItems="center">
			<Stack sx={{width: 1}}><MyFooter me={me} currentPage={PAGE.STATS}/></Stack>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{width: 0.9}}>
				<MyAvatar user={user}/>
				<Stack sx={{width: 0.6, display: {xs: "none", sm: "none", md: "flex", lg: "flex"}}}>
					<MySearchBar />
				</Stack>
				<Box>
					<IconButton
						aria-label="show more"
						aria-controls="menu-achievements"
						aria-haspopup="true"
						onClick={handleAchievementMenuOpen}
						color="inherit"
					>
						<MenuIcon sx={{fontSize: "40px"}}/>
					</IconButton>
				</Box>
			</Stack>
			<Stack
				sx={{width: 1, height: "90%"}}
				direction="row"
				justifyContent="center"
			>
				<Stack	
					sx={{width: 0.9, height: 0.8}}
					direction="column"
					spacing={7}
					>
					<Stack
						direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
						justifyContent="space-between"
						sx={{backgroundColor: "green", borderRadius: 5, padding: "15px"}}
					>
						<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Matchs joués : {user.played}</Typography>
						<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Classement : {user.rank}</Typography>
						<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Victoires : {user.victories}</Typography>
						<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Défaites : {user.defeats}</Typography>
					</Stack>
					<Stack
						sx={{height: 2/12}}
						direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
					>
						<Typography variant="h4" style={{color: 'white', fontFamily: "Myriad Pro", textAlign: "center"}}>Historique</Typography>
					</Stack>
					<MyHistory user={user}/>
					
				</Stack>
			</Stack>
			{openAchievements ? <MyAchievements user={user} setOpen={setOpenAchievements}/> : null}
			{openDemandeAmis ? <MyRequestFriends setOpen={setOpenDemandeAmis}/> : null}
			{renderAchievementMenu}
		</Stack>
	);
}

export default Stats;