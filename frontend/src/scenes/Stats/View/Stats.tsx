import { Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import MyHistory from '../Components/MyHistory';
import MyAvatar from '../../../components/MyAvatar';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import useMe from '../../../Services/Hooks/useMe';
import useUserStats from '../Services/useUserStats';
import MyFooter from '../../../components/MyFooter';
import React from 'react';
import MySearchBar from '../../Home/Components/MySearchBar';
import useUsers from '../../../Services/Hooks/useUsers';
import UserManagement from '../Components/UserManagement';
import { PAGE } from '../../../Services/Interface/Interface';

const Stats = () => {
	const { login } = useParams();
	const user = useUserStats(login);
	const me = useMe();
	const users = useUsers();

	if (me === undefined || user === undefined || users === undefined)
		return (<MyChargingDataAlert />);

	return (
		<Stack direction="column" spacing={{xs: 3, sm: 3, md: 4, lg: 6, xl: 8}} alignItems="center" sx={{heigth: "100vh"}}>
			<Stack sx={{width: 1}}><MyFooter me={me} currentPage={PAGE.STATS}/></Stack>
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{width: 0.9, height: 0.2}}>
				<MyAvatar user={user}/>
				<Stack sx={{width: 0.6, display: {xs: "none", sm: "none", md: "flex", lg: "flex"}}}>
					<MySearchBar />
				</Stack>
				<UserManagement user={user}/>
			</Stack>
			<Stack
				direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
				justifyContent="space-between"
				sx={{width: 0.9, height: 0.1, backgroundColor: "green", borderRadius: 5, padding: "15px"}}
			>
				<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Matchs joués : {user.played}</Typography>
				<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Classement : {user.rank}</Typography>
				<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Victoires : {user.victories}</Typography>
				<Typography variant="h5" style={{fontFamily: "Myriad Pro"}}>Défaites : {user.defeats}</Typography>
			</Stack>
			<Stack
				sx={{height: 0.1}}
				direction={{ xs: 'column', sm: 'column', md: 'row', lg: 'row' }}
			>
				<Typography variant="h4" style={{color: 'white', fontFamily: "Myriad Pro", textAlign: "center"}}>Historique</Typography>
			</Stack>
			<Stack	
				sx={{width: 0.9, height: "40vh", backgroundColor: "ffffff"}}
				direction="column"
				>
				<MyHistory user={user}/>
			</Stack>
		</Stack>
	);
}

export default Stats;