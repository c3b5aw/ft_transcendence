import { Badge, Box, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MessageIcon from '@mui/icons-material/Message';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import useMe from "../../../Services/Hooks/useMe";
import { Friend, User, USER_STATUS } from "../../../Services/Interface/Interface";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useSnackbar } from "notistack";
import axios from "axios";
import MenuIcon from '@mui/icons-material/Menu';
import { api, apiBlock, apiChannel, apiChat, apiDM, apiGame, apiUsers } from "../../../Services/Api/Api";
import { useNavigate } from "react-router-dom";
import MyAchievements from "./MyAchievements";
import MyRequestFriends from "./MyRequestFriends";
import { MATCHTYPE } from "../../Game/Services/utils";
import { matchJoinDuel } from "../../Game/Services/wsGame";
import MyFriends from "./MyFriends";

function UserManagement(props: {user: User}) {
	const { user} = props;
	const me = useMe();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [openUserManagement, setOpenUserManagement] = useState<boolean>(false);
	const [openAchievements, setOpenAchievements] = useState<boolean>(false);
	const [openListFriends, setOpenListFriends] = useState<boolean>(false);
	const [openDemandeAmis, setOpenDemandeAmis] = useState<boolean>(false);

	const [friends, setFriends] = useState<Friend[]>([]);
	const [friendsPending, setFriendsPending] = useState<Friend[]>([]);
	const [requested, setRequested] = useState<Friend[]>([]);
	const [blocked, setBlocked] = useState<Friend[]>([]);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setOpenUserManagement(true);
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setOpenUserManagement(false);
		setAnchorEl(null);
	};

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
		const fetchInvitation = async () => {
			try {
				const response = await axios.get(`/api/profile/friends/requested`);
				setRequested(response.data);
			}
			catch (err) {
				enqueueSnackbar(`${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		const fetchBlocked = async () => {
			try {
				const response = await axios.get(`/api/profile/friends/blocked`);
				setBlocked(response.data);
			}
			catch (err) {
				enqueueSnackbar(`${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchFriendsMe();
		fetchFriendsMePending();
		fetchInvitation();
		fetchBlocked();
	}, [enqueueSnackbar, openUserManagement])

	async function handleAddFriend(login: string) {
		try {
			await axios.put(`${api}${apiUsers}/${login}/friend`)
			enqueueSnackbar(`Demande d'ami envoyé à ${login}`, { 
				variant: 'success',
				autoHideDuration: 2000,
			});
		}
		catch (err) {
			enqueueSnackbar(`Impossible de demander en ami ${login} (${err})`, { 
				variant: 'error',
				autoHideDuration: 3000,
			});
		}
	}

	async function handleDeleteFriend(login: string) {
		try {
			await axios.delete(`${api}${apiUsers}/${login}/friend`)
			enqueueSnackbar(`${login} ne fait plus parti de vos amis`, { 
				variant: 'success',
				autoHideDuration: 3000,
			});
		}
		catch (err) {
			enqueueSnackbar(`Impossible de supprimer ${login} de vos amis (${err})`, { 
				variant: 'error',
				autoHideDuration: 3000,
			});
		}
	}

	async function handleSendMessage(login: string) {
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

	async function handleBlockUser(login: string) {
		if (login !== undefined) {
			try {
				await axios.put(`${api}${apiUsers}/${login}${apiBlock}`);
				enqueueSnackbar(`${login} a été bloqué`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
			}
			catch (err) {
				enqueueSnackbar(`Impossible de bloquer ${login} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
	}

	async function handleUnBlockUser(login: string) {
		if (login !== undefined) {
			try {
				await axios.delete(`${api}${apiUsers}/${login}${apiBlock}`);
				enqueueSnackbar(`${login} a été débloqué`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
			}
			catch (err) {
				enqueueSnackbar(`Impossible de débloquer ${login} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
	}

	if (me === undefined) {
		return (null);
	}

	const isFriend = friends.find(friend => friend.login === user.login);
	const isFriendPending = friendsPending.find(friendPending => friendPending.login === user.login);
	const isRequested = requested.find(request => request.login === user.login);
	const isBlocked = blocked.find(blocked => blocked.login === user.login);
	return (
		<Stack direction="column">
			<Box>
				<IconButton
					aria-label="show more"
					aria-controls="menu-achievements"
					aria-haspopup="true"
					onClick={handleClick}
					color="inherit"
				>
					<MenuIcon sx={{fontSize: "40px"}}/>
				</IconButton>
			</Box>
			{openUserManagement ? <Menu
				anchorEl={anchorEl}
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
				open={true}
				onClose={handleClose}
			>
				{user.login !== me.login ?
					<MenuItem onClick={() => {
						handleSendMessage(user.login);
					}}>
						<IconButton>
							<MessageIcon />
						</IconButton>
						<p>Send message</p>
					</MenuItem> : null}
				{user.login !== me.login && isFriend !== undefined && user.status === USER_STATUS.ONLINE ?
					<MenuItem onClick={() => {
						matchJoinDuel(MATCHTYPE.MATCH_DUEL, user.login);
						navigate(`${apiGame}/roomview`)
					}}>
						<IconButton>
							<SportsEsportsIcon />
						</IconButton>
						<p>Duel</p>
					</MenuItem> : null}
				<MenuItem onClick={() => {
						setOpenAchievements(true);
						handleClose();
					}}>
					<IconButton>
						<EmojiEventsIcon />
					</IconButton>
					<p>Achievements</p>
				</MenuItem>
				<MenuItem onClick={() => {
						setOpenListFriends(true);
						handleClose();
					}}>
					<IconButton>
						<PeopleIcon />
					</IconButton>
					<p>Amis</p>
				</MenuItem>
				{user.login === me.login ?
					<MenuItem onClick={() => {
							setOpenDemandeAmis(true)
							handleClose();
						}}>
						<IconButton>
							<Badge
								badgeContent={friendsPending.length > 0 ? friendsPending.length : null}
								color="primary"
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'left',
								}}
							>
								<GroupAddIcon />
							</Badge>
						</IconButton>
						<p>Demandes d'amis</p>
					</MenuItem> : null}
				{user.login !== me.login && isFriendPending !== undefined ?
					<MenuItem onClick={() => {
							setOpenDemandeAmis(true);
							handleClose();
						}}>
						<IconButton>
							<PersonAddIcon />
						</IconButton>
						<p>Voir invitations</p>
					</MenuItem> : null}
					{/* l'user n'est pas mon profile + pas de demande recu de l'user + l'user nest pas mon ami + pas de demande d'ami envers l'user */}
				{user.login !== me.login && isFriendPending === undefined && isFriend === undefined && isRequested === undefined && isBlocked === undefined ?
					<MenuItem onClick={() => {
							handleAddFriend(user.login);
							handleClose();
						}}>
						<IconButton>
							<PersonAddIcon />
						</IconButton>
						<p>Demander en ami</p>
					</MenuItem> : null}
				{/* l'user n'est pas mon profile + pas de demande recu de l'user + l'user nest pas mon ami + demande d'ami envers l'user */}
				{user.login !== me.login && isFriendPending === undefined && isRequested !== undefined && isFriend === undefined ?
					<MenuItem>
						<IconButton>
							<AccessTimeIcon />
						</IconButton>
						<p>Demande d'ami envoyée</p>
					</MenuItem> : null}
				{/* l'user n'est pas mon profile + pas de demande recu de l'user + l'user nest pas mon ami + demande d'ami envers l'user */}
				{user.login !== me.login && isFriendPending === undefined && isRequested !== undefined && isFriend === undefined ?
					<MenuItem onClick={() => {
							handleDeleteFriend(user.login);
							handleClose();
						}}>
						<IconButton>
							<DeleteIcon />
						</IconButton>
						<p>Supprimer la demande</p>
					</MenuItem> : null}
				{/* l'user n'est pas mon profile + l'user est mon ami */}
				{user.login !== me.login && isFriend !== undefined ?
					<MenuItem onClick={() => {
							handleDeleteFriend(user.login);
							handleClose();
						}}>
						<IconButton>
							<DeleteIcon />
						</IconButton>
						<p>Supprimer de la liste d'amis</p>
					</MenuItem> : null}
				{user.login !== me.login && isBlocked === undefined ?
					<MenuItem onClick={() => {
							handleBlockUser(user.login);
							handleClose();
						}}>
						<IconButton>
							<RemoveCircleOutlineIcon />
						</IconButton>
						<p>Bloquer</p>
					</MenuItem> : null}
				{user.login !== me.login && isBlocked !== undefined ?
					<MenuItem onClick={() => {
							handleUnBlockUser(user.login);
							handleClose();
						}}>
						<IconButton>
							<AddCircleOutlineIcon />
						</IconButton>
						<p>Débloquer</p>
					</MenuItem> : null}
			</Menu> : null}
			{openAchievements ? <MyAchievements user={user} setOpen={setOpenAchievements}/> : null}
			{openListFriends ? <MyFriends user={user} setOpen={setOpenListFriends}/> : null}
			{openDemandeAmis ? <MyRequestFriends setOpen={setOpenDemandeAmis}/> : null}
		</Stack>
	);
}

export default UserManagement;