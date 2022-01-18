import { CircularProgress, Stack } from "@mui/material";
import { useState } from "react";
import MySnackBar from "./MySnackbar";

function MyChargingDataAlert() {
	const [error, setError] = useState<string>("Données en cours de chargement");
	return (
		<Stack sx={{width: 1, height: "100vh"}} direction="row" alignItems="center" justifyContent="center">
			<CircularProgress sx={{color: "white"}} />
			<MySnackBar message={`${error}`} severity="info" time={3000} setError={setError}/>
		</Stack>
	);
}

export default MyChargingDataAlert;