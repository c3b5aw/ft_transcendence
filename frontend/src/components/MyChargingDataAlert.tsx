import { CircularProgress, Stack } from "@mui/material";

function MyChargingDataAlert() {
	return (
		<Stack
			sx={{width: 1, height: "100vh"}}
			direction="row"
			alignItems="center"
			justifyContent="center"
		>
			<CircularProgress sx={{color: "white"}} />
		</Stack>
	);
}

export default MyChargingDataAlert;