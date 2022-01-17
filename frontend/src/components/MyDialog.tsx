import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import React from "react";
import { ISearchBar, User } from "../services/Interface/Interface";
import MySearchBarChat from "./MySearchBarChat";
import CloseIcon from '@mui/icons-material/Close';

function MyDialog(props: {users: User[]}) {

    const { users } = props;
    const [open, setOpen] = React.useState(true);
	const [addFriends, setAddFriends] = React.useState<User[]>([]);

	function handleClickCell(user: User) {
		const tmp = addFriends.filter(item => item.login === user.login)
		if (tmp.length === 0) {
			setAddFriends(addFriends => [...addFriends, user])
		}
	}

	const handleRemoveFriend = (user: User) => {
		setAddFriends(addFriends.filter(item => item.login !== user.login))
	}

	const handleClose = () => {
		setOpen(false);
	};
    const fSearchBar: ISearchBar = {
		handleClickCell: handleClickCell
	}
    return (
        <Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				style: {
				  backgroundColor: '#FFFFFF',
				  color:'black'
				},
			  }}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle>New channel</DialogTitle>
			<DialogContent>
				<Box sx={{ flexGrow: 1, marginTop: 1}}>
					<Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
						{addFriends.map((friend) => (
						<Grid item xs={3.5} key={friend.id}>
							<Button onClick={() => handleRemoveFriend(friend)} key={friend.id} size="small" variant="contained" endIcon={<CloseIcon />}>
								{friend.login}
					 		</Button>
						</Grid>
						))}
					</Grid>
				</Box>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="Channel name"
					type="text"
					fullWidth
					variant="standard"
				/>
				<TextField
					autoFocus
					margin="dense"
					id="password"
					label="Channel password"
					type="password"
					fullWidth
					variant="standard"
				/>
				<div style={{marginTop: 10}}></div>
				<MySearchBarChat users={users} fSearchBar={fSearchBar} />
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleClose}>Create</Button>
			</DialogActions>
		</Dialog>
    );
}

export default MyDialog;