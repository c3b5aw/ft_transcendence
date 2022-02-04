import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import MyFooter from "../../../components/MyFooter";
import { apiGame } from "../../../Services/Api/Api";
import useMe from "../../../Services/Hooks/useMe";
import { PAGE } from "../../../Services/Interface/Interface";
import { socketMatchmaking } from "../../../Services/ws/utils";
import MatchMaking from "./MatchMaking";
import MatchProgress from "./MatchsProgress";

function MenuGame() {
	const [openMatchMaking, setOpenMatchMaking] = useState<boolean>(false);
	const [openViewMatchs, setOpenViewMatchs] = useState<boolean>(false);
	const [successJoin, setSuccessJoin] = useState<boolean>(false);
	const me = useMe();
	const navigate = useNavigate();

	useEffect(() => {
		socketMatchmaking.on("matchmaking::onJoin", (data) => {
			setSuccessJoin(true);
		})
	}, [])

	useEffect(() => {
		socketMatchmaking.on("matchmaking::onLeave", (data) => {
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
			<MyFooter me={me} currentPage={PAGE.GAME}/>
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
					onClick={() => navigate(`${apiGame}/roomview`)}
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
			</Stack>
		</Stack>
	);
}

export default MenuGame;