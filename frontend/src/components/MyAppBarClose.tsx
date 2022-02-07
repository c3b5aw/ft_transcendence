import { AppBar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

function MyAppBarClose(props: {setOpen: Function, name: string}) {
	const { setOpen, name } = props;

	const handleClose = () => {
		setOpen(false);
	}

	return (
		<AppBar sx={{ position: 'relative' }}>
			<Toolbar>
				<Stack direction="row" alignItems="center" spacing={2}>
					<IconButton
						edge="end"
						color="inherit"
						onClick={handleClose}
						aria-label="close"
					>
						<CloseIcon sx={{fontSize: "24px"}}/>
					</IconButton>
					<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>{name}</Typography>
				</Stack>
			</Toolbar>
		</AppBar>
	);
}

export default MyAppBarClose;