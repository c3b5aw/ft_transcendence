import { AppBar, Button, Dialog, IconButton, Toolbar } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { IListUser } from "../Services/interface";
import MyListUser from "./MyListUser";
import CloseIcon from '@mui/icons-material/Close';

function MyDialogListFriend(props: {setOpen: Dispatch<SetStateAction<boolean>>, myListFriends: IListUser}) {
	const { setOpen, myListFriends } = props;

	const handleClose = () => {
		setOpen(false);
	};

    return (
        <Dialog
			open={true}
			fullScreen
			onClose={handleClose}
			PaperProps={{
				style: {
				  backgroundColor: '#1d3033',
				  color:'white'
				},
			  }}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
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
			<MyListUser myList={myListFriends}/>
		</Dialog>
	);
}

export default MyDialogListFriend;