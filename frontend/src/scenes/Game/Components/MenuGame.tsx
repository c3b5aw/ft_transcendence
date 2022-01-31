import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import MyFooter from "../../../components/MyFooter";
import useMe from "../../../Services/Hooks/useMe";
import MatchMaking from "./MatchMaking";
import MatchProgress from "./MatchsProgress";

function MenuGame() {
	const [openMatchMaking, setOpenMatchMaking] = useState<boolean>(false);
	const [openViewMatchs, setOpenViewMatchs] = useState<boolean>(false);
	const me = useMe();

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
					onClick={() => setOpenMatchMaking(true)}
					sx={{padding: 4, borderRadius: 4}}
				>
					<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Rechercher une partie</Typography>
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