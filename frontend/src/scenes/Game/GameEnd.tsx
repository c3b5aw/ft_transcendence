import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import GameScoreBoard from "./GameScoreBoard";

function GameEnd(props: any) {

	const handleClose = () => {
		props.handleQuit();
	};

	const handleLaunchGame = () => {
		handleClose();
	}

	return (
		<Dialog
			open={true}
			onClose={handleClose}
			PaperProps={{
				style: {
				  backgroundColor: '#FFFFFF',
				  color:'black',
				  borderRadius: 3
				},
			}}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle sx={{backgroundColor: "green", marginBottom: 2}}>
				<Typography style={{fontFamily: "Myriad Pro", fontSize:"24px", color: "white"}}>Game is Over</Typography>
			</DialogTitle>
			<DialogContent>
				<GameScoreBoard players={props.players} />
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
					onClick={handleClose}
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