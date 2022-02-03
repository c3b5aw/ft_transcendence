import { Avatar, Badge, Box, IconButton, List, ListItemButton, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiStats } from '../../../Services/Api/Api';
import { User, USER_STATUS } from '../../../Services/Interface/Interface';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import BanKickMute from './BanKickMute';
import { IBanKickMute, IListUser } from '../Services/interface';
import { ROLE } from '../../../Services/Api/Role';
import useMe from '../../../Services/Hooks/useMe';

function MyListUser(props : { myList: IListUser }) {
	const { myList } = props;
	const navigate = useNavigate();
	const [open, setOpen] = useState<boolean>(true);
	const [myBanKickMute, setMyBanKickMute] = useState<IBanKickMute>();
	const me = useMe();
	const user: User[] = myList.users.filter(item => item.login === me?.login);

	const handleClick = (login: string) => {
		navigate(`${apiStats}/${login}`)
	}

	function handleClickOptionUser(user: User) {
		const myBanKickMute: IBanKickMute = {
			name_channel: myList.name_channel,
			user: user,
			open: true,
			closeModal: setOpen,
		}
		setOpen(true);
		setMyBanKickMute(myBanKickMute);
	}

	const checkRoleMe = () => {
		if (me !== undefined && myList.isListChannel && user.length > 0) {
			// console.log(user[0]);
			return (user[0].role === ROLE.ADMIN || user[0].role === ROLE.MODERATOR);
		}
		return (false);
	}

	function DisplayOptionUser(props: {user: User}) {
		const { user } = props;
		return (
			<IconButton onClick={() => handleClickOptionUser(user)}>
				<MoreVertIcon style={{color: "white"}}/>
			</IconButton>
		);
	}

	return (
        <Stack
			direction="column"
			sx={{width: 1, boxShadow: 3, borderTopLeftRadius: 11, borderTopRightRadius: 11}}
		>
			<Box sx={{backgroundColor: "#D68910"}}>
				<h3 style={{textAlign: "start", paddingLeft: "15px", paddingRight: "15px"}}>{myList.name_list}</h3>
			</Box>
			{myList.users.length > 0 ?
				<List sx={{overflow: "auto"}}>
					{myList.users.map(user => (
						<Stack
							direction="row"
							key={user.id}
							alignItems="center"
						>
							<ListItemButton
								component="div"
								onClick={() => handleClick(user.login)}
							>
								<Stack
									sx={{ width: 1, height: 1}}
									alignItems="center"
									direction="row"
									spacing={2}
								>
									<Badge badgeContent={""} 
										color={user.status === USER_STATUS.ONLINE ? "success" :
										user.status === USER_STATUS.IN_GAME ? "warning" : "error"}>
										<Avatar
											sx={{marginLeft: "10px",
												width: "32px",
												height: "32px",}}
											src={`/api/users/${user.login}/avatar`}>
										</Avatar>
									</Badge>
									<h4 style={{color: "white"}}>{user.login}</h4>
								</Stack>
							</ListItemButton>
							{checkRoleMe() ? <DisplayOptionUser user={user}/> : null}
						</Stack>
					))}
				</List> : <div style={{color: "grey", textAlign: "center", margin: 20, fontFamily: "Myriad Pro", fontSize: "25px"}}>No Users</div>
			}
			{myBanKickMute !== undefined && open ? <BanKickMute myBanKickMute={myBanKickMute} /> : null}
		</Stack>
    );
}

export default MyListUser;