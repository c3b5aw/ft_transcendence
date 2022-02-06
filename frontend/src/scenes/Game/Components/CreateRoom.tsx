import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, TextField, Typography } from "@mui/material";
import React from "react";
import { Dispatch, SetStateAction, useState } from "react";
import MySearchBarChat from "../../Chat/Components/MySearchBarChat";
import CloseIcon from '@mui/icons-material/Close';
import { ISearchBar, User } from "../../../Services/Interface/Interface";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import { MATCHTYPE } from "../Services/utils";
import { matchJoinDuel, matchJoinNormal } from "../Services/wsGame";
import { useSnackbar } from 'notistack'
import useMeFriends from "../../Chat/Services/Hooks/useMeFriends";

function CreateRoom(props: {me: User, setOpen: Dispatch<SetStateAction<boolean>>}) {
	const { me, setOpen } = props;
	const [isDuel, setIsDuel] = useState<boolean>(false);
	const [friend, setFriend] = useState<User>();
	const friends = useMeFriends();
	const [nameRoom, setNameRoom] = useState<string>("");
	const { enqueueSnackbar } = useSnackbar();

	const handleClose = () => {
		setOpen(false);
	}

	const handleChange = () => {
		setIsDuel(!isDuel);
	}

	const handleRemoveFriend = (user: User) => {
		setFriend(undefined);
	}

	const fSearchBar: ISearchBar = {
		handleClickCell: handleAddFriend
	}

	function handleAddFriend(user: User) {
		setFriend(user);
	}

	const handleCreateRoom = () => {
		if (isDuel && friend !== undefined) {
			matchJoinDuel(MATCHTYPE.MATCH_DUEL, friend.login);
			handleClose();
		}
		else if (nameRoom !== "") {
			matchJoinNormal(MATCHTYPE.MATCH_NORMAL, me.login);
			handleClose();
		}
		else {
			enqueueSnackbar(`Formulaire incorrect`, { 
				variant: 'warning',
				autoHideDuration: 3000,
			});
		}
	}

	const  handleTextChangeName = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setNameRoom(event.target.value);
	};

	if (friends === undefined) {
		return (
			<MyChargingDataAlert />
		);
	}
	return (
		<Dialog
			open={true}
			onClose={handleClose}
		>
			<DialogContent>
				<Typography variant="h5" sx={{fontFamily: "Myriad Pro"}}>Create new room</Typography>
				<FormControlLabel
					control={<Checkbox onChange={handleChange}/>}
					label="Is it a duel ? "
				/>
				{isDuel ?
					<React.Fragment>
					<MySearchBarChat
						users={friends}
						fSearchBar={fSearchBar}
						nameBar="Invite a friend"
					/>
					<div style={{marginTop: 10}}></div>
					{friend !== undefined ? 
						<Button 
							onClick={() => handleRemoveFriend(friend)}
							key={friend.login}
							size="small"
							variant="contained"
							endIcon={<CloseIcon />}
						>
							{friend.login}
						</Button> : null}
					</React.Fragment> :
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Room name"
						type="text"
						fullWidth
						variant="standard"
						onChange={handleTextChangeName}
					/>
				}
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					onClick={() => setOpen(false)}
					color="error"
				>
					<Typography>Cancel</Typography>
				</Button>
				<Button
					variant="contained"
					color="success"
					onClick={() => handleCreateRoom()}
				>
					<Typography>Create</Typography>
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CreateRoom;