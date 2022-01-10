import { Avatar, Stack } from '@mui/material';
import { UserListProps, UserProps } from '../utils/Interface';
import MyListFriends from '../components/MyListFriends';
import MyLadder from '../components/MyLadder';

const ClassementPage = (props: UserListProps ) => {

	const me: UserProps = {
		id: 1,
		login: "mojombo",
		avatar_url: "",
		following_url: "",
		subscriptions_url: ""
	};

	return (
		<Stack sx={{width: 1, height: 1}} direction="row">
			<Stack sx={{ width: 0.2, height: "100vh" }} direction="column" alignItems="center">
				<Stack sx={{ width: 1, height: 1/4 }} direction="column" alignItems="center" justifyContent="center" spacing={3}>
					<Avatar
						src={me.avatar_url}
						sx={{ width: "126px", height: "126px" }}>
					</Avatar>
					<h2>{me.login}</h2>
					<h3 style={{ color: 'grey' }}>Join le 03/01/2022</h3>
				</Stack>
			</Stack>
			<Stack sx={{ width: 0.6, height: "100vh" }} direction="column" alignItems="center" justifyContent="center">
				<Stack sx={{ width: 0.9, height: "80vh" }} direction="column" alignItems="center" justifyContent="center">
					<MyLadder rows={props.items}/>
				</Stack>
			</Stack>
			<Stack sx={{ width: 0.2, height: "100vh" }} direction="column" alignItems="center">
				<MyListFriends items={props.items}/>
			</Stack>
		</Stack>
	);
}

export default ClassementPage;
