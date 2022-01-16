import { CircularProgress, Stack } from "@mui/material";
import MySnackBar from "./MySnackbar";

function MyChargingDataAlert() {
	return (
		<Stack sx={{width: 1, height: "100vh"}} direction="row" alignItems="center" justifyContent="center">
			<CircularProgress sx={{color: "white"}} />
			<MySnackBar message="Données en cours de chargement" severity="info" time={3000}/>
		</Stack>
	);
}

export default MyChargingDataAlert;