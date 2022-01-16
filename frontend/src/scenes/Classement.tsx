import { Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import MyAvatar from '../components/MyAvatar';
import MyChargingDataAlert from '../components/MyChargingDataAlert';
import MyError from '../components/MyError';
import MyLadder from '../components/MyLadder';
import { api, apiMe } from '../services/Api/Api';
import { User } from '../services/Interface/Interface';

function Classement() {
	const [me, setMe] = useState<User>();
	const [error, setError] = useState<unknown>("");

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const response = await axios.get(`${api}${apiMe}`)
				setMe(response.data);
				return response
			} catch (err) {
				setError(error);
			}
		}
		fetchMe();
	}, [error])

	// eslint-disable-next-line eqeqeq
	if (me == undefined && error === "")
		return (<MyChargingDataAlert />);
	// eslint-disable-next-line eqeqeq
	else if (error !== "" || me == undefined)
		return (<MyError error={error}/>);
	return (
		<Stack sx={{width: 1, height: 1}} direction="row">
			<Stack sx={{ width: 0.2, height: "100vh" }} direction="column" alignItems="center">
				<MyAvatar user={me} />
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
