import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import MyFooter from '../../../components/MyFooter';
import MySearchBar from '../Components/MySearchBar';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import useUsers from '../../../Services/Hooks/useUsers';
import useMe from '../../../Services/Hooks/useMe';
import { Typography } from '@mui/material';

export default function Home() {
	const users = useUsers();
	const me = useMe();

	const navigate = useNavigate();
  
	function handleLaunchGame() {
		navigate('/game');
	}

	if ((me === undefined || users === undefined))
		return (<MyChargingDataAlert />);

	return (
		<Stack
			direction="column"
			sx={{width: 1, height: "100%"}}
		>
			<MyFooter me={me}/>
			<Stack sx={{alignItems: "center", justifyContent: "center", height: "15em"}}>
				<MySearchBar users={users}/>
			</Stack>
			<Stack sx={{alignItems: "center", justifyContent: "center", height: "15em"}}>
				<Typography variant="h1" style={{fontFamily: "Myriad Pro"}}>ft_transcendance</Typography>
			</Stack>
			<Stack sx={{alignItems: "center", justifyContent: "center", height: "35em"}}>
				<Button sx={{
					background: 'white',
					color: '#000000',
					'&:hover': {
						backgroundColor: '#D5D5D5',
						color: '#000000',
					},
					padding: {xs: 1, sm: 2, md: 3, lg: 4},
					borderRadius: {xs: 4, sm: 4, md: 4, lg: 4},
					border: 5,
				}}
					onClick={() => handleLaunchGame()}>
					<Typography variant="h2" style={{fontFamily: "Myriad Pro"}}>Start Game</Typography>
				</Button>
			</Stack>
		</Stack>
	);
}
