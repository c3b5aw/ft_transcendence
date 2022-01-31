import { AppBar, Button, IconButton, Toolbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction } from "react";

function MyAppBarClose(props: {setOpen: Dispatch<SetStateAction<boolean>>}) {
	const { setOpen } = props;

	const handleClose = () => {
		setOpen(false);
	}

	return (
		<AppBar sx={{ position: 'relative' }}>
			<Toolbar>
				<IconButton
					edge="end"
					color="inherit"
					onClick={handleClose}
					aria-label="close"
				>
					<CloseIcon />
				</IconButton>
				<Button autoFocus color="inherit" onClick={handleClose}>
					Close
				</Button>
			</Toolbar>
		</AppBar>
	);
}

export default MyAppBarClose;