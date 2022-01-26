import { Stack } from "@mui/material";

function MyMissing(){
	return (
		<Stack sx={{width: 1, height: "100vh"}}>
			<p>La page demandé n'existe pas</p>
		</Stack>
	);
}

export default MyMissing;