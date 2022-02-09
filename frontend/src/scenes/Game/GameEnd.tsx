import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiGame, apiMatchmaking } from "../../Services/Api/Api";
import { User } from "../../Services/Interface/Interface";
import GameAchievementsRecent from "./GameAchievementsRecent";
import GamePlayer from "./GamePlayer";
import GameScoreBoard from "./GameScoreBoard";
import { matchLeave } from "./Services/wsGame";

function GameEnd(props: {me: User, handleQuit: any, players: GamePlayer[], winner: any}) {
	const navigate = useNavigate();
	const handleQuit = () => {
		props.handleQuit();
	};

	const handleLaunchGame = () => {
		matchLeave();
		handleQuit();
		navigate(`${apiGame}${apiMatchmaking}`);
	}

	return (
		<Dialog
			open={true}
			onClose={handleQuit}
			PaperProps={{
				style: {
				  backgroundColor: '#FFFFFF',
				  color:'black',
				  borderRadius: 3
				},
			}}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle sx={{
					backgroundColor: props.winner.login === props.me.login ? "green" : "#C63627",
					marginBottom: 2
				}}
			>
				<Typography style={{fontFamily: "Myriad Pro", fontSize:"24px", color: "white"}}>{props.winner.login === props.me.login ? "Victoire !" : "Défaite !"}</Typography>
			</DialogTitle>
			<DialogContent>
				<Stack direction="column" spacing={2}>
					<GameScoreBoard players={props.players} />
					<GameAchievementsRecent />
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={handleLaunchGame}
					variant="contained"
					color="success"
				>
					Lancer une partie classée
				</Button>
				<Button
					onClick={handleQuit}
					variant="contained"
					color="error"
				>
					Quitter
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default GameEnd;