import { Avatar, CircularProgress, List, ListItem, ListItemButton, Paper, Stack } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import Divider from '@mui/material/Divider';
import { UserListProps, UserProps } from '../utils/Interface';
import { avatarStyle } from '../styles/Styles';
import { api, apiUsers } from '../utils/Api';
import { useNavigate } from 'react-router';

// function Row(props: { row: UserProps }) {


function MyListFriends(props: { items: UserProps[] }) {
	const { items } = props;
	const navigate = useNavigate();
	const me: UserProps = {
		id: 1,
		login: "eoliveir",
		avatar_url: "https://avatars.githubusercontent.com/u/2?v=4",
		following_url: "elie",
		subscriptions_url: "elie2"
	}
	const connected = true

	const handleClick = (login: string) => {
		navigate(`${api}${apiUsers}/${login}`)
	}

	return (
        <Stack direction="column" sx={{width: 1, height: "100vh", boxShadow: 3, borderTopLeftRadius: 11, borderTopRightRadius: 11}} alignItems="center">
			<Stack direction="row" sx={{width: 1, height: 1/12}} alignItems="center" justifyContent="space-between">
				<Stack direction="row" sx={{width: 1, height: 3/4}} alignItems="center" spacing={2}>
					<Avatar src={me.avatar_url} sx={{marginLeft: "3%", width: "64px", height: "64px"}}></Avatar>
					<h1>{me.login}</h1>
				</Stack>
				{connected ? 
					<CircleIcon sx={{fontSize: "28px", color: "green", marginRight: "3%"}}></CircleIcon> :
					<CircleIcon sx=
					{{fontSize: "28px", color: "red", marginRight: "3%"}}></CircleIcon>}
			</Stack>
			<Divider />
			<Stack sx={{width: 1, height: 0.9}} direction="column">
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{backgroundColor: "white", borderTopLeftRadius: 11, borderTopRightRadius: 11}}>
					<h2 style={{ marginLeft: '11px', fontFamily: "Myriad Pro", color:'black' }}>List friends</h2>
					<h2 style={{ marginRight: '11px', fontFamily: "Myriad Pro", color:'black' }}>{items.length} / 12</h2>
				</Stack>
				<Divider />
				{items.length > 0 ?
					<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto'}}>
						<List>
							{items.map(user => (
								<div key={user.id}>
									<ListItem component="div" disablePadding>
										<ListItemButton onClick={() => handleClick(user.login)}>
											<Stack direction="row" alignItems="center" sx={{width: 1}}>
												<Stack sx={{ width: 1, height: 1}} alignItems="center" direction="row">
													<Stack sx={{ width: "85%", height: 1}} alignItems="center" spacing={2} direction="row">
														<Avatar sx={avatarStyle} src=""></Avatar>
														<h2>{user.login}</h2>
													</Stack>
												</Stack>
												{user.id !== 2 ? 
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

// const User = (fetchUser: UserProps) => {
// 	axios.get<UserProps>(`${usersApi}/${fetchUser.login}`)
// 	.then((response) => {
// 		console.log(response.data);
// 	})
// 	.catch(function (error) {
// 		console.log(error.message);
// 	})
// 	return (
//         <h1>OK !</h1>
//     );
// }