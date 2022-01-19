import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import MyFooter from '../../../components/MyFooter';
import { boxStyle, StyleH1, useStyles } from '../../../styles/Styles';
import MySearchBar from '../Components/MySearchBar';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import useUsers from '../../../services/Hooks/useUsers';
import useMe from '../../../services/Hooks/useMe';

export default function Home() {
	const users = useUsers();
	const me = useMe();

	const classes = useStyles();
	const styleH1 = StyleH1();
	const navigate = useNavigate();


	function handleLaunchGame() {
		navigate('/game');
	}

	if ((me === undefined || users === undefined))
		return (<MyChargingDataAlert />);
	return (
		<Stack direction="row" sx={{width: 1, minHeight: "100vh"}}>
			<Stack direction="column" sx={{width: 1}}>
				<Stack direction="column" sx={{width: 1, height: 0.85}}>
					<Box className={classes.box} sx={boxStyle}>
						<MySearchBar users={users}/>
					</Box>
					<Box className={classes.box} sx={boxStyle}>
						<h1 className={styleH1.root}>ft_transcendance</h1>
					</Box>
					<Box className={classes.box} sx={boxStyle}>
						<Button sx={{
							background: 'white',
							color: '#000000',
							'&:hover': {
								backgroundColor: '#D5D5D5',
								color: '#000000',
							},
							width: '25%',
							borderRadius: 5,
							border: 5,
							fontSize: '20px',
						}}
							onClick={() => handleLaunchGame()}>
							<h1>Start Game</h1>
							</Button>
					</Box>
				</Stack>
				<Stack direction="row" sx={{width: 1, height: 0.08}}>
					<MyFooter me={me}/>
				</Stack>
				</Stack>
		 </Stack>
	);
}