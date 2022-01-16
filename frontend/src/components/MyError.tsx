import { Alert, AlertTitle, Stack } from "@mui/material";
import MySnackBar from "./MySnackbar";

function MyError(props : {error: unknown}) {
	const { error } = props;
	return (
		<Stack sx={{width: 1, height: "100vh"}} direction="column" alignItems="center" justifyContent="center">
			<Alert severity="error">
			<AlertTitle>Error</AlertTitle>
				{`${error}`}
			</Alert>
			<MySnackBar message={`${error}`} severity="error" time={10000}/>
		</Stack>
	);
}

export default MyError;