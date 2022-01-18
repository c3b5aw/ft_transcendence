import { Alert, AlertTitle, Stack } from "@mui/material";

function MyError(props : {error: unknown}) {
	const { error } = props;
	return (
		<Stack sx={{width: 1, height: "100vh"}} direction="column" alignItems="center" justifyContent="center">
			<Alert severity="error">
			<AlertTitle>Error</AlertTitle>
				{`${error}`}
			</Alert>
		</Stack>
	);
}

export default MyError;