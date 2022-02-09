import { Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyAppBarClose from "../../../components/MyAppBarClose";
import { apiGame, apiRoomsView } from "../../../Services/Api/Api";
import { PAGE } from "../../../Services/Interface/Interface";
import { socketMatchmaking } from "../../../Services/ws/utils";
import { MATCHTYPE } from "../Services/utils";
import { matchJoinRanked, matchLeave } from "../Services/wsGame";

function MatchMaking() {
	const navigate = useNavigate();

	const handleClose = () => {
		matchLeave();
		navigate(`${apiGame}${apiRoomsView}`);
	}

	useEffect(() => {
		socketMatchmaking.on("matchmaking::onMatch", (data) => {
			navigate(`${apiGame}/${data.match.hash}`);
		})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		matchJoinRanked(MATCHTYPE.MATCH_RANKED);
	}, [])

	return (
		<Dialog
			open={true}
			fullScreen
			onClose={handleClose}
			PaperProps={{
				style: {
				  backgroundColor: '#1d3033',
				  color:'white'
				},
			}}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
            <MyAppBarClose setOpen={handleClose} name={PAGE.MATCHMAKING}/>
			<DialogContent>
				<Stack sx={{height: 1, alignItems: "center", justifyContent: "center"}}>
					<Typography
						variant="h3"
						style={{color: 'grey', fontFamily: "Myriad Pro"}}
					>
						Veuillez patienter, nous recherchons un joueur...
					</Typography>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

export default MatchMaking;