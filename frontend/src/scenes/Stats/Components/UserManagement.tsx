import { Box, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MessageIcon from '@mui/icons-material/Message';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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

function UserManagement(props: {user: User}) {
	const { user} = props;
	const me = useMe();
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [openUserManagement, setOpenUserManagement] = useState<boolean>(false);
	const [openAchievements, setOpenAchievements] = useState<boolean>(false);
	const [openDemandeAmis, setOpenDemandeAmis] = useState<boolean>(false);

	const [friends, setFriends] = useState<Friend[]>([]);
	const [friendsPending, setFriendsPending] = useState<Friend[]>([]);
	const [requested, setRequested] = useState<Friend[]>([]);

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
		fetchFriendsMe();
		fetchFriendsMePending();
		fetchInvitation();
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
				await axios.put(`${api}${apiUsers}/${login}${apiBlock}`);
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

	const isFriend = friends.filter(function (friend) {
		return (friend.login === user.login);
	});
	const isFriendPending = friendsPending.filter(function (friendPending) {
		return (friendPending.login === user.login);
	});
	const isRequested = requested.filter(function (request) {
		return (request.login === user.login);
	});

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
				{user.login !== me.login && isFriend.length > 0 && user.status === USER_STATUS.ONLINE ?
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
				{user.login === me.login ?
					<MenuItem onClick={() => {
							setOpenDemandeAmis(true)
							handleClose();
						}}>
						<IconButton>
							<PeopleIcon />
						</IconButton>
						<p>Demandes d'amis</p>
					</MenuItem> : null}
				{user.login !== me.login && isFriendPending.length !== 0 ?
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
				{user.login !== me.login && isFriendPending.length === 0 && isFriend.length === 0 && isRequested.length === 0 ?
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
				{user.login !== me.login && isFriendPending.length === 0 && isRequested.length !== 0 && isFriend.length === 0 ?
					<MenuItem>
						<IconButton>
							<AccessTimeIcon />
						</IconButton>
						<p>Demande d'ami envoyée</p>
					</MenuItem> : null}
				{/* l'user n'est pas mon profile + pas de demande recu de l'user + l'user nest pas mon ami + demande d'ami envers l'user */}			{user.login !== me.login && isFriendPending.length === 0 && isRequested.length !== 0 && isFriend.length === 0 ?
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
				{user.login !== me.login && isFriend.length !== 0 ?
					<MenuItem onClick={() => {
							handleDeleteFriend(user.login);
							handleClose();
						}}>
						<IconButton>
							<DeleteIcon />
						</IconButton>
						<p>Supprimer de la liste d'amis</p>
					</MenuItem> : null}
				{user.login !== me.login ?
					<MenuItem onClick={() => {
							handleBlockUser(user.login);
							handleClose();
						}}>
						<IconButton>
							<RemoveCircleOutlineIcon />
						</IconButton>
						<p>Bloquer</p>
					</MenuItem> :
					<MenuItem onClick={() => {
							handleUnBlockUser(user.login);
							handleClose();
						}}>
						<IconButton>
							<AddCircleOutlineIcon />
						</IconButton>
						<p>Débloquer</p>
					</MenuItem>
				}
			</Menu> : null}
			{openAchievements ? <MyAchievements user={user} setOpen={setOpenAchievements}/> : null}
			{openDemandeAmis ? <MyRequestFriends setOpen={setOpenDemandeAmis}/> : null}
		</Stack>
	);
}

export default UserManagement;