import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ISearchBarChannel, User } from "../../../../Services/Interface/Interface";
import { useSnackbar } from 'notistack'
import CloseIcon from '@mui/icons-material/Close';
import { Channel } from "../../Services/interface";
import useChannels from "../../Services/useChannels";
import MySearchBarChannels from "../MySearchBarChannels";
import LockIcon from '@mui/icons-material/Lock';
import useChannelsJoin from "../../Services/useChannelsJoin";
import { socket } from "../../../../Services/ws/utils";

function JoinChannel(props: { setOpen: Dispatch<SetStateAction<boolean>>, reload: boolean, setReload: Dispatch<SetStateAction<boolean>>, me: User}) {
	const { setOpen, reload, setReload } = props;
    const [open2, setOpen2] = useState(true);
	const { enqueueSnackbar } = useSnackbar();
	const channels = useChannels();
	const joinChannels = useChannelsJoin();

	const [joinChannel, setJoinChannel] = useState<Channel>();
	const [passwordChannel, setPasswordChannel] = useState<string>("");


	const handleClose = () => {
		setOpen(false);
		setOpen2(false);
	};

	const channelJoin = () => {
		if (joinChannel !== undefined) {
			socket.emit("channel::join", JSON.stringify({
				channel: `${joinChannel.name}`,
				password: passwordChannel,
			}));
		}
	}

	// useEffect(() => {
	// 	socket.on("channel::onJoin", (data) => {
	// 		console.log(data);
	// 	});
	// })

	const handleJoinChannel = () => {
		channelJoin();
		console.log(socket);
		setReload(!reload);
		setOpen(false);
		setOpen2(false);
		console.log("JOIN");
	}

	function handleAddChannel(channel: Channel) {
		if (!joinChannels.some(item => item.name === channel.name))
			setJoinChannel(channel);
		else {
			enqueueSnackbar(`Vous etes deja dans le channel ${channel.name}`, { 
				variant: 'warning',
				autoHideDuration: 3000,
			});
		}
	}

	function handleRemoveChannel(channel: Channel) {
		setJoinChannel(undefined);
	}
	const ISearchBarChannel: ISearchBarChannel = {
		handleClickCell: handleAddChannel,
	};

	const  handleChangeValuePassword = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setPasswordChannel(event.target.value);
	};

	return (
		<Dialog
			open={open2}
			onClose={handleClose}
			PaperProps={{
				style: {
				  backgroundColor: '#FFFFFF',
				  color:'black'
				},
			  }}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<DialogTitle>
				Join Channel
			</DialogTitle>
			<DialogContent>
				{joinChannel !== undefined ? 
					<Button onClick={() => handleRemoveChannel(joinChannel)} key={joinChannel.name} size="small" variant="contained" endIcon={<CloseIcon />}>
						{joinChannel.name}
					</Button> : null}
					<div><p></p></div>
				{joinChannel !== undefined && joinChannel.private ?
					<Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
						<LockIcon fontSize="large"/>
						<TextField
							autoFocus
							margin="dense"
							id="password_channel"
							label="Enter password"
							type="password"
							fullWidth
							variant="standard"
							onChange={handleChangeValuePassword}
						/>
					</Stack> : null
				}
				<div><p></p></div>
				<MySearchBarChannels channels={channels} fSearchBarChannel={ISearchBarChannel} nameBar="Search channels..."/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} variant="contained" color="error">Cancel</Button>
				<Button onClick={handleJoinChannel} variant="contained" color="success">Join</Button>
			</DialogActions>
		</Dialog>
	);
}

export default JoinChannel;