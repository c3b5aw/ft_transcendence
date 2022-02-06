import { AppBar, IconButton, Toolbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function MyAppBarClose(props: {setOpen: Function}) {
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
			</Toolbar>
		</AppBar>
	);
}

export default MyAppBarClose;