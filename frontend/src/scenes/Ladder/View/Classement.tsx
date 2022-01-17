import { Stack } from '@mui/material';
import MyAvatar from '../../../components/MyAvatar';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import MyLadder from '../Components/MyLadder';
import useMe from '../../../services/Hooks/useMe';

function Classement() {
	const me = useMe();

	// eslint-disable-next-line eqeqeq
	if (me == undefined)
		return (<MyChargingDataAlert />);
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
		</Stack>
	);
}

export default Classement;
