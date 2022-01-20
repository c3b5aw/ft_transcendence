import { Avatar, Badge, CircularProgress, IconButton, List, ListItem, ListItemButton, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import { apiStats } from '../../../services/Api/Api';
import { User } from '../../../services/Interface/Interface';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BanKickMute from './BanKickMute';
import { Channel } from '../Services/interface';
import { useSnackbar } from 'notistack'

// function Row(props: { row: UserProps }) {


function MyListFriends(props : {me: User | undefined, url: string, isListUserChannel: boolean, channel?: Channel}) {
	const { me, url, isListUserChannel, channel } = props;
	const [users, setUsers] = useState<User[]>([]);
	const [open, setOpen] = useState<boolean>(false);
	const [userCurrent, setUserCurrent] = useState<User>();
	const { enqueueSnackbar } = useSnackbar();

	const navigate = useNavigate();

	const handleClick = (user: User) => {
		navigate(`${apiStats}/${user.login}`)
	}

	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const reponse = await axios.get(`${url}`);
				setUsers(reponse.data);
			} catch (err) {
				enqueueSnackbar(`Impossible de charger la liste amis (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchFriends();
	}, [enqueueSnackbar, me, url])

	function handleOpenDialogBan(user: User) {
		setUserCurrent(user);
		setOpen(!open);
	}

	if (me === undefined)
	{
		return (
			<Stack direction="column" sx={{width: 1, height: "100vh"}} alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}
	return (
        <Stack direction="column" sx={{width: 1, height: "100vh", boxShadow: 3, borderTopLeftRadius: 11, borderTopRightRadius: 11}} alignItems="center">
			{isListUserChannel && open && userCurrent !== undefined ? <BanKickMute user={userCurrent} setOpen={setOpen}/> : null}
			<Stack sx={{width: 1, height: 1}} direction="column">
				<Stack sx={{backgroundColor: "#1d3033", width: 1, height: 1}} direction="column">
					<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', backgroundColor: "#1d3033"}}>
						{users.length > 0 ?
						<List>
							{users.map(user => (
								<div key={user.id}>
									<ListItem component="div" disablePadding>
										<Stack direction="row" alignItems="center" sx={{width: 1}}>
											<ListItemButton onClick={() => handleClick(user)}>
												<Stack sx={{ width: 1, height: 1}} alignItems="center" direction="row">
													<Stack sx={{ width: "85%", height: 1}} alignItems="center" spacing={2} direction="row">
														<Badge badgeContent={""} color={user.connected ? "success" : "error"}>
															<Avatar
																sx={{marginLeft: "10px",
																	width: "40px",
																	height: "40px",}}
																src={`http://127.0.0.1/api/users/${user.login}/avatar`}>
															</Avatar>
														</Badge>
														<h3 style={{color: "white"}}>{user.login}</h3>
													</Stack>
												</Stack>
											</ListItemButton>
											{isListUserChannel && channel !== undefined && channel.owner_id === me.id ?
												<IconButton onClick={() => handleOpenDialogBan(user)}>
													<MoreVertIcon sx={{fontSize: "24px", color: "white", marginRight: "3%"}}></MoreVertIcon>
												</IconButton> : null
											}
										</Stack>
									</ListItem>
								</div>
							))}
						</List> : null
						}
					</Paper>
				</Stack>
			</Stack>
		</Stack>
    );
}

export default MyListFriends;