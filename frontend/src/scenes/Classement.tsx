import { Avatar, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import MyLadder from '../components/MyLadder';
import MyListFriends from '../components/MyListFriends';
import { api, apiMe, apiUsers } from '../services/Api/Api';
import { User } from '../services/Interface/Interface';

function Classement() {
	const [me, setMe] = useState<User>();

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}${apiMe}`)
				setMe(response.data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchMe();
	}, [])

	return (
		<Stack sx={{width: 1, height: 1}} direction="row">
			<Stack sx={{ width: 0.2, height: "100vh" }} direction="column" alignItems="center">
				<Stack sx={{ width: 1, height: 1/4 }} direction="column" alignItems="center" justifyContent="center" spacing={3}>
					<Avatar
						src={me?.avatar}
						sx={{ width: "126px", height: "126px" }}>
					</Avatar>
					<h2>{me?.login}</h2>
					<h3 style={{ color: 'grey' }}>Join le 03/01/2022</h3>
				</Stack>
			</Stack>
			<Stack sx={{ width: 0.6, height: "100vh" }} direction="column" alignItems="center" justifyContent="center">
				<Stack sx={{ width: 0.9, height: "80vh" }} direction="column" alignItems="center" justifyContent="center">
					<MyLadder />
				</Stack>
			</Stack>
			<Stack sx={{ width: 0.2, height: "100vh" }} direction="column" alignItems="center">
				<MyListFriends me={me}/>
			</Stack>
		</Stack>
	);
}

export default Classement;
