import { Avatar, CircularProgress, List, ListItem, ListItemButton, Paper, Stack } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router';
import { api, apiUsers } from '../services/Api/Api';
import { avatarStyle } from '../styles/Styles';
import { User } from '../services/Interface/Interface';
import { useEffect, useState } from 'react';
import axios from 'axios';

// function Row(props: { row: UserProps }) {


function MyListFriends(props : {me: User | undefined}) {
	const { me } = props;
	const [friends, setFriends] = useState<User[]>([]);
	
	const navigate = useNavigate();

	const handleClick = (login: string) => {
		navigate(`${api}${apiUsers}/${login}`)
	}
	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const reponse = await axios.get(`${api}${apiUsers}`);
				setFriends(reponse.data);
			} catch (err) {
				console.log(err);
			}
		}
		// eslint-disable-next-line eqeqeq
		if (me != undefined)
			fetchFriends();
	}, [me])

	// eslint-disable-next-line eqeqeq
	if (me == undefined)
	{
		return (
			<Stack direction="column" sx={{width: 1, height: "100vh"}} alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}
	return (
        <Stack direction="column" sx={{width: 1, height: "100vh", boxShadow: 3, borderTopLeftRadius: 11, borderTopRightRadius: 11}} alignItems="center">
			<Stack direction="row" sx={{width: 1, height: 1/12}} alignItems="center" justifyContent="space-between">
				<Stack direction="row" sx={{width: 1, height: 3/4}} alignItems="center" spacing={2}>
					<Avatar src={me?.avatar} sx={{marginLeft: "3%", width: "64px", height: "64px"}}></Avatar>
					<h1>{me?.login}</h1>
				</Stack>
				{me?.connected ? 
					<CircleIcon sx={{fontSize: "28px", color: "green", marginRight: "3%"}}></CircleIcon> :
					<CircleIcon sx=
					{{fontSize: "28px", color: "red", marginRight: "3%"}}></CircleIcon>}
			</Stack>
			<Divider />
			<Stack sx={{width: 1, height: 0.9}} direction="column">
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{backgroundColor: "white", borderTopLeftRadius: 11, borderTopRightRadius: 11}}>
					<h2 style={{ marginLeft: '11px', fontFamily: "Myriad Pro", color:'black' }}>List friends</h2>
					<h2 style={{ marginRight: '11px', fontFamily: "Myriad Pro", color:'black' }}>0 / {friends.length}</h2>
				</Stack>
				<Divider />
				{friends.length > 0 ?
					<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto'}}>
						<List>
							{friends.map(friend => (
								<div key={friend.id}>
									<ListItem component="div" disablePadding>
										<ListItemButton onClick={() => handleClick(friend.login)}>
											<Stack direction="row" alignItems="center" sx={{width: 1}}>
												<Stack sx={{ width: 1, height: 1}} alignItems="center" direction="row">
													<Stack sx={{ width: "85%", height: 1}} alignItems="center" spacing={2} direction="row">
														<Avatar sx={avatarStyle} src=""></Avatar>
														<h2>{friend.login}</h2>
													</Stack>
												</Stack>
												{friend.id !== 2 ? 
												<CircleIcon sx={{fontSize: "28px", color: "green", marginRight: "3%"}}></CircleIcon> :
												<CircleIcon sx=
												{{fontSize: "28px", color: "red", marginRight: "3%"}}></CircleIcon>}
											</Stack>
										</ListItemButton>
									</ListItem>
									<Divider sx={{marginBottom: "5px", marginTop: "5px"}}/>
								</div>
							))}
						</List>
					</Paper> : null
				}
			</Stack>
		</Stack>
    );
}

export default MyListFriends;