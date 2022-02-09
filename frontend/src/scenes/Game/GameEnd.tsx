import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { User } from "../../Services/Interface/Interface";
import GameAchievementsRecent from "./GameAchievementsRecent";
import GamePlayer from "./GamePlayer";
import GameScoreBoard from "./GameScoreBoard";
import { MATCHTYPE } from "./Services/utils";
import { matchJoinRanked, matchLeave } from "./Services/wsGame";

function GameEnd(props: {me: User, handleQuit: any, players: GamePlayer[], winner: any}) {

	const handleQuit = () => {
		props.handleQuit();
	};

	const handleLaunchGame = () => {
		matchLeave();
		matchJoinRanked(MATCHTYPE.MATCH_RANKED);
		handleQuit();
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
					Relancer une partie
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