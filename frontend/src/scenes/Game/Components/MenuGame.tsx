import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import MyFooter from "../../../components/MyFooter";
import { apiGame, apiRoomsView } from "../../../Services/Api/Api";
import useMe from "../../../Services/Hooks/useMe";
import { PAGE } from "../../../Services/Interface/Interface";
import MatchProgress from "./MatchsProgress";

function MenuGame() {
	const [openViewMatchs, setOpenViewMatchs] = useState<boolean>(false);
	const me = useMe();
	const navigate = useNavigate();

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
					onClick={() => navigate(`${apiGame}${apiRoomsView}`)}
					sx={{padding: 4, borderRadius: 4}}
				>
					<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Faire une partie</Typography>
				</Button>
				<Button
					variant="contained"
					onClick={() => setOpenViewMatchs(true)}
					sx={{padding: 4, borderRadius: 4}}
				>
					<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Afficher les matchs en cours</Typography>
				</Button>
				{openViewMatchs ? <MatchProgress setOpen={setOpenViewMatchs} /> : null}
			</Stack>
		</Stack>
	);
}

export default MenuGame;