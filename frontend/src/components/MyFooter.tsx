import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { api, apiUsers } from "../services/Api/Api";
import { User } from "../services/Interface/Interface";
import { boxStyle, buttonStyle, useStyles } from "../styles/Styles";

export default function MyFooter(props : {me: User | undefined}) {
	const { me } = props;
	const navigate = useNavigate();
	const classes = useStyles();

	function handleLaunchStats() {
		// eslint-disable-next-line eqeqeq
		if (me?.login != undefined)
			navigate(`${api}${apiUsers}/${me?.login}`);
	}

	function handleLaunchClassement() {
		navigate('/classement');
	}

	function handleLaunchParametres() {
		navigate('/parametres');
	}
	return (
		<Box className={classes.box} sx={boxStyle}>
			<Button sx={buttonStyle}
				onClick={() => handleLaunchStats()}>
				<h2>Statistiques</h2>
			</Button>
			<Button sx={buttonStyle}
				onClick={() => handleLaunchClassement()}>
				<h2>Classement</h2>
			</Button>
			<Button sx={{
				background: 'white',
				color: '#000000',
				'&:hover': {
					backgroundColor: '#D5D5D5',
					color: '#000000',
				},
				width: '12%',
				borderRadius: 5,
				border: 5,
			}}
				onClick={() => handleLaunchParametres()}>
				<h2>Paramètres</h2>
			</Button>
		</Box>
	);
};