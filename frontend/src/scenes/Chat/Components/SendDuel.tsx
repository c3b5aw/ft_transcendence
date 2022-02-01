import { Button, Dialog, DialogActions, DialogContent, Stack } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import MyAppBarClose from "../../../components/MyAppBarClose";
import { apiGame, apiLadder, apiStats } from "../../../Services/Api/Api";
import { MATCHTYPE } from "../../Game/Services/utils";
import { matchJoinDuel } from "../../Game/Services/wsGame";

function SendDuel(props: {setOpen: Dispatch<SetStateAction<boolean>>, login: string}) {
	const { setOpen, login } = props;
	const navigate = useNavigate();

	const handleClose = () => {
		setOpen(false);
	};

	const handleShowStats = () => {
		navigate(`${apiStats}/${login}`);
	}

	const handleSendDuel = () => {
		matchJoinDuel(MATCHTYPE.MATCH_DUEL, login);
		navigate(`${apiGame}/roomview`);
	}

	const handleShowLadder = () => {
		navigate(`/classement`);
	}

	return (
		<Dialog
			open={true}
			onClose={handleClose}
			PaperProps={{
				style: {
				  backgroundColor: '#1d3033',
				  color:'white'
				},
			  }}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogContent>
				<Stack direction="column" spacing={4}>
					<Button variant="contained" onClick={handleShowStats}>Voir stats</Button>
                	<Button variant="contained" onClick={handleSendDuel}>Demander en duel</Button>
                	<Button variant="contained" onClick={handleShowLadder}>Voir classement</Button>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="error" onClick={handleClose}>Cancel</Button>
			</DialogActions>
		</Dialog>
	);
}

export default SendDuel;