import { Box, Stack, Typography } from '@mui/material';
import MyAvatar from '../../../components/MyAvatar';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import MyLadder from '../Components/MyLadder';
import useMe from '../../../Services/Hooks/useMe';
import MyFooter from '../../../components/MyFooter';

function Classement() {
	const me = useMe();

	if (me === undefined)
		return (<MyChargingDataAlert />);
	return (
		<Stack sx={{width: 1}} direction="column" spacing={10}>
			<MyFooter me={me}/>
			<Stack alignItems="flex-start">
				<MyAvatar user={me} />
			</Stack>
			<Stack direction="column" alignItems="center" spacing={5}>
				<Typography variant="h3" style={{fontFamily: "Myriad Pro"}}>Classement</Typography>
				<MyLadder me={me}/>
			</Stack>
		</Stack>
	);
}

export default Classement;
