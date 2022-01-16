import { Avatar, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import MyAvatar from '../components/MyAvatar';
import MyLadder from '../components/MyLadder';
import { api, apiMe } from '../services/Api/Api';
import { User } from '../services/Interface/Interface';

function Classement() {
	const [me, setMe] = useState<User>();

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const response = await axios.get(`${api}${apiMe}`)
				setMe(response.data);
				return response
			} catch (err) {
				console.log(err);
			}
		}
		fetchMe();
	}, [])

	return (
		<Stack sx={{width: 1, height: 1}} direction="row">
			<Stack sx={{ width: 0.2, height: "100vh" }} direction="column" alignItems="center">
				<MyAvatar login={me?.login} role={me?.role} />
			</Stack>
			<Stack sx={{ width: 0.8, height: "100vh" }} direction="column" alignItems="center" justifyContent="center">
				<Stack sx={{ width: 0.9, height: "80vh" }} direction="column" alignItems="center" justifyContent="center">
					<MyLadder me={me}/>
				</Stack>
			</Stack>
			{/* <Stack sx={{ width: 0.2, height: "100vh" }} direction="column" alignItems="center">
				<MyList me={me} url={`${api}${apiUsers}/${me?.login}${apiFriends}`}/>
			</Stack> */}
		</Stack>
	);
}

export default Classement;
