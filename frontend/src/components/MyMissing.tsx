import { Stack, Typography } from "@mui/material";
import useMe from "../Services/Hooks/useMe";
import MyChargingDataAlert from "./MyChargingDataAlert";
import MyFooter from "./MyFooter";

function MyMissing(){
	const me = useMe();
	if (me === undefined) {
		return (
			<MyChargingDataAlert />
		);
	}
	return (
		<Stack sx={{width: 1, height: "100vh"}}>
			<MyFooter me={me}/>
			<Stack sx={{height: 0.9}}>
				<Typography variant="h4" sx={{fontFamily: "Myriad Pro"}}>404 Not Found</Typography>
			</Stack>
		</Stack>
	);
}

export default MyMissing;