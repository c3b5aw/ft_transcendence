import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { ISearchBarChannel } from "../../../../Services/Interface/Interface";
import { useSnackbar } from 'notistack'
import CloseIcon from '@mui/icons-material/Close';
import { Channel } from "../../Services/interface";
import useChannels from "../../Services/Hooks/useChannels";
import MySearchBarChannels from "../MySearchBarChannels";
import LockIcon from '@mui/icons-material/Lock';
import { channelJoin } from "../../Services/wsChat";
import useChannelsJoin from "../../Services/Hooks/useChannelsJoin";

function JoinChannel(props: { setOpen: Dispatch<SetStateAction<boolean>> }) {
	const { setOpen } = props;
    const [open2, setOpen2] = useState(true);
	const { enqueueSnackbar } = useSnackbar();
	const allChannels = useChannels();
	const joinChannels = useChannelsJoin();

	const [joinChannel, setJoinChannel] = useState<Channel>();
	const [passwordChannel, setPasswordChannel] = useState<string>("");

	const handleClose = () => {
		setOpen(false);
		setOpen2(false);
	};

	const handleJoinChannel = () => {
		if (joinChannel !== undefined) {
			if (!joinChannel.private) {
				channelJoin(joinChannel.name, "");
			}
			else {
				channelJoin(joinChannel.name, passwordChannel);
			}
		}
	}

	const handleAddChannel = (channel: Channel) => {
		if (!joinChannels.some(item => item.name === channel.name))
			setJoinChannel(channel);
		else {
			enqueueSnackbar(`Vous etes deja dans le channel ${channel.name}`, { 
				variant: 'warning',
				autoHideDuration: 3000,
			});
		}
	}

	const handleRemoveChannel = (channel: Channel) => {
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
				Join new channel
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
				<MySearchBarChannels channels={allChannels} fSearchBarChannel={ISearchBarChannel} nameBar="Search channels..."/>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={handleClose}
					variant="contained"
					color="error"
				>
					Cancel
				</Button>
				<Button
					onClick={handleJoinChannel}
					variant="contained"
					color="success"
				>
					Join
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default JoinChannel;