import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function MySnackBar(props: {message: string, severity: AlertColor, time: number}) {
	const { message, severity, time } = props;
	const [open, setOpen] = React.useState(true);

	const handleClose = (event?: React.SyntheticEvent | Event) => {
		setOpen(false);
	};

	return (
		<Stack spacing={2} sx={{ width: '100%', position: "absolute" }}>
			<Snackbar open={open} autoHideDuration={time} onClose={handleClose}>
			<Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
				{message}
			</Alert>
			</Snackbar>
		</Stack>
	);
}

export default MySnackBar;