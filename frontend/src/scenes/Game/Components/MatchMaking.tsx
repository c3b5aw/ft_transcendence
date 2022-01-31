import { Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MyAppBarClose from "../../../components/MyAppBarClose";
import { socketMatchmaking } from "../../../Services/ws/utils";
import { MATCHTYPE } from "../Services/utils";
import { matchJoin, matchLeave } from "../Services/wsGame";

function MatchMaking(props: {setOpen: Dispatch<SetStateAction<boolean>>}) {
	const { setOpen } = props;
	const [findMatch, setFindMatch] = useState(null);

	const handleClose = () => {
		matchLeave();
		setOpen(false);
	}

	useEffect(() => {
		socketMatchmaking.on("matchmaking::onMatch", (data) => {
			setFindMatch(data)
		})
	}, [])

	useEffect(() => {
		matchJoin(MATCHTYPE.MATCH_RANKED);
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
            <MyAppBarClose setOpen={handleClose} />
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