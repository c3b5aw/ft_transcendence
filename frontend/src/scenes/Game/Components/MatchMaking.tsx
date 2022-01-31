import { Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MyAppBarClose from "../../../components/MyAppBarClose";
import { socket } from "../../../Services/ws/utils";
import { MATCHTYPE } from "../Services/utils";
import { matchOnJoin } from "../Services/wsGame";

function MatchMaking(props: {setOpen: Dispatch<SetStateAction<boolean>>}) {
	const { setOpen } = props;
	const [findMatch, setFindMatch] = useState(null);

	const handleClose = () => {
		setOpen(false);
	}

	useEffect(() => {
		socket.on("matchmaking::onMatch", (data) => {
			console.log(data);
			setFindMatch(data)
		})
	}, [])

	useEffect(() => {
		matchOnJoin(MATCHTYPE.MATCH_RANKED);
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
            <MyAppBarClose setOpen={setOpen} />
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