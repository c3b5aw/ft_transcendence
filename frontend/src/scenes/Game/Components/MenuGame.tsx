import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import MyFooter from "../../../components/MyFooter";
import useMe from "../../../Services/Hooks/useMe";
import { socketMatchmaking } from "../../../Services/ws/utils";
import MatchMaking from "./MatchMaking";
import MatchProgress from "./MatchsProgress";
import RoomsView from "./RoomsView";

function MenuGame() {
	const [openMatchMaking, setOpenMatchMaking] = useState<boolean>(false);
	const [openViewMatchs, setOpenViewMatchs] = useState<boolean>(false);
	const [openRooms, setOpenRooms] = useState<boolean>(false);
	const [successJoin, setSuccessJoin] = useState<boolean>(false);
	const me = useMe();

	useEffect(() => {
		socketMatchmaking.on("matchmaking::onJoin", (data) => {
			console.log(data);
			setSuccessJoin(true);
		})
	}, [])

	useEffect(() => {
		socketMatchmaking.on("matchmaking::onLeave", (data) => {
			console.log(data);
			setSuccessJoin(false);
		})
	}, [])

	if (me === undefined) {
		return (
			<MyChargingDataAlert />
		);
	}

	return (
		<Stack direction="column">
			<MyFooter me={me}/>
			<Stack
				direction="column"
				alignItems="center"
				justifyContent="center"
				spacing={12}
				minHeight="100vh"
			>
				<Typography variant="h2" style={{fontFamily: "Myriad Pro", color: "white"}}>Menu</Typography>
				<Button
					variant="contained"
					disabled={successJoin ? true : false}
					onClick={() => setOpenMatchMaking(true)}
					sx={{padding: 4, borderRadius: 4}}
				>
					<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Rechercher une partie classée</Typography>
				</Button>
				<Button
					variant="contained"
					onClick={() => setOpenRooms(true)}
					sx={{padding: 4, borderRadius: 4}}
				>
					<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Rejoindre une partie</Typography>
				</Button>
				<Button
					variant="contained"
					onClick={() => setOpenViewMatchs(true)}
					sx={{padding: 4, borderRadius: 4}}
				>
					<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Afficher les matchs en cours</Typography>
				</Button>
				{openMatchMaking ? <MatchMaking setOpen={setOpenMatchMaking} /> : null}
				{openViewMatchs ? <MatchProgress setOpen={setOpenViewMatchs} /> : null}
				{openRooms ? <RoomsView setOpen={setOpenRooms} /> : null}
			</Stack>
		</Stack>
	);
}

export default MenuGame;