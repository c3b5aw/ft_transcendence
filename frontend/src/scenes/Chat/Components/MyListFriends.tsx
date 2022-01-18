import { Avatar, CircularProgress, List, ListItem, ListItemButton, Paper, Stack } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useNavigate } from 'react-router';
import { apiStats } from '../../../services/Api/Api';
import { Friends, User } from '../../../services/Interface/Interface';
import { useEffect, useState } from 'react';
import axios from 'axios';

// function Row(props: { row: UserProps }) {


function MyListFriends(props : {me: User | undefined, url: string}) {
	const { me } = props;
	const { url } = props
	const [friends, setFriends] = useState<Friends[]>([]);
	
	const navigate = useNavigate();

	const handleClick = (login: string) => {
		navigate(`${apiStats}/${login}`)
	}

	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const reponse = await axios.get(`${url}`);
				setFriends(reponse.data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchFriends();
	}, [me, url])

	// eslint-disable-next-line eqeqeq
	if (me == undefined)
	{
		return (
			<Stack direction="column" sx={{width: 1, height: "100vh"}} alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}
	console.log(friends);
	return (
        <Stack direction="column" sx={{width: 1, height: "100vh", boxShadow: 3, borderTopLeftRadius: 11, borderTopRightRadius: 11}} alignItems="center">
			<Stack sx={{width: 1, height: 1}} direction="column">
				<Stack sx={{backgroundColor: "#1d3033", width: 1, height: 1}} direction="column">
					<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', backgroundColor: "#1d3033"}}>
						{friends.length > 0 ?
						<List>
							{friends.map(friend => (
								<div key={friend.user_id}>
									<ListItem component="div" disablePadding>
										<ListItemButton onClick={() => handleClick(friend.user_login)}>
											<Stack direction="row" alignItems="center" sx={{width: 1}}>
												<Stack sx={{ width: 1, height: 1}} alignItems="center" direction="row">
													<Stack sx={{ width: "85%", height: 1}} alignItems="center" spacing={2} direction="row">
														<Avatar
															sx={{marginLeft: "10px",
																width: "40px",
																height: "40px",}}
															src={`http://127.0.0.1/api/users/${friend.user_login}/avatar`}>
														</Avatar>
														<h3 style={{color: "white"}}>{friend.user_login}</h3>
													</Stack>
												</Stack>
												{friend.id !== 2 ? 
												<CircleIcon sx={{fontSize: "24px", color: "green", marginRight: "3%"}}></CircleIcon> :
												<CircleIcon sx=
												{{fontSize: "24px", color: "red", marginRight: "3%"}}></CircleIcon>}
											</Stack>
										</ListItemButton>
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