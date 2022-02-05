import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import MyFooter from '../../../components/MyFooter';
import MySearchBar from '../Components/MySearchBar';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import useMe from '../../../Services/Hooks/useMe';
import { Typography } from '@mui/material';
import { PAGE } from '../../../Services/Interface/Interface';

export default function Home() {
	const me = useMe();

	const navigate = useNavigate();
  
	function handleLaunchGame() {
		navigate('/game');
	}

	if (me === undefined)
		return (<MyChargingDataAlert />);
	return (
		<Stack direction="column" sx={{height: "100vh", width: 1}}>
			<MyFooter me={me} currentPage={PAGE.HOME}/>
			<Stack
				direction="column"
				sx={{width: 1, height: 1}}
				justifyContent="space-evenly"
				alignItems="center"
			>
				<Stack sx={{alignItems: "center", justifyContent: "center", width: 0.5}}>
					<MySearchBar />
				</Stack>
				<Stack sx={{alignItems: "center", justifyContent: "center"}}>
					<Typography variant="h2" style={{fontFamily: "Myriad Pro"}}>ft_transcendance</Typography>
				</Stack>
				<Stack sx={{alignItems: "center", justifyContent: "center"}}>
					<Button sx={{
						background: 'white',
						color: '#000000',
						'&:hover': {
							backgroundColor: '#D5D5D5',
							color: '#000000',
						},
						padding: {xs: 1, sm: 2, md: 3, lg: 4},
						borderRadius: {xs: 4, sm: 4, md: 6, lg: 8},
						border: 4,
					}}
						onClick={() => handleLaunchGame()}>
						<Typography variant="h3" style={{fontFamily: "Myriad Pro"}}>Start Game</Typography>
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
}
