import { Button, CircularProgress, IconButton, List, ListItem, ListItemButton, Paper, Stack } from '@mui/material';
import { api, apiChannel, apiChannels, apiUsers } from '../../../../Services/Api/Api';
import { User } from '../../../../Services/Interface/Interface';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Channel } from '../../Services/interface';
import MyDialogCreateChannel from './MyDialogCreateChannel';
import SettingsAdmin from './SettingsAdmin';
import SettingsM from './SettingsMember';
import { useSnackbar } from 'notistack'
import JoinChannel from './JoinChannel';
import { socket } from '../../../../Services/ws/utils';

function MyListChannels(props : {me: User, setChannel: Dispatch<SetStateAction<Channel | undefined>>}) {
	const { me, setChannel } = props;
	const [channels, setChannels] = useState<Channel[]>([]);
	const [open, setOpen] = useState<boolean>(false);
	const [openJoin, setOpenJoin] = useState<boolean>(false);
	const [openSettingsAdmin, setOpenSettingsAdmin] = useState<boolean>(false);
	const [openSettingsM, setOpenSettingsM] = useState<boolean>(false);
	const [channelTmp, setChannelTmp] = useState<Channel>();
	const [reload, setReload] = useState<boolean>(false);
	const [reload2, setReload2] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();

	const buttonStyle = {
		border: "3px solid black",
		borderRadius: "10px",
		color: "black",
		fontFamily: "Myriad Pro",
		padding: "10px",
		backgroundColor: "white",
		fontSize: "14px",
		'&:hover': {
			backgroundColor: '#D5D5D5',
			color: '#000000',
		},
	}

	socket.on("channel::onJoin", (data) => {
		setReload2(!reload2);
	});

	useEffect(() => {
		const fetchChannels = async () => {
			try {
				const reponse = await axios.get(`${api}${apiChannels}/joined`);
				setChannels(reponse.data);
			} catch (err) {
				enqueueSnackbar(`Impossible de charger la liste des channels (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchChannels();
	}, [me, reload, reload2, enqueueSnackbar])

	function handleCreateChannel() {
		setOpen(!open);
	}

	function handleJoinChannel() {
		setOpenJoin(!openJoin);
	}

	async function HandleClickChannel(channel: Channel) {
		const response = await axios.get(`${api}${apiChannel}/${channel.name}${apiUsers}`);
		const res = (response.data.filter((user: { login: string; }) => user.login === me.login))
		if (res.length > 0) {
			setChannel(channel);
		}
		else {
			enqueueSnackbar(`Impossible de consulter les messages car tu n'es pas dans le channel`, { 
				variant: 'warning',
				autoHideDuration: 3000,
			});
		}
	}

	function handleClickSettingsChannel(channel: Channel) {
		if (channel.owner_id === me.id) {
			setChannelTmp(channel);
			setOpenSettingsAdmin(true);
		}
		else {
			setChannelTmp(channel);
			setOpenSettingsM(true);
		}
	}

	if (me === undefined) {
		return (
			<Stack direction="column" sx={{width: 1, height: "100vh"}} alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}
	return (
		<Stack direction="column" sx={{width: 1.5/12, height: 1}}>
			{open ? <MyDialogCreateChannel reload={reload} setReload={setReload} />: null}
			{openJoin ? <JoinChannel setOpen={setOpenJoin} setChannel={setChannel}/>: null}
			<Stack direction="column" sx={{width: 1, height: 0.9, boxShadow: 3}}>
				{/* load channels */}
				<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', backgroundColor: "#1d3033"}}>
					{channels.length > 0 ?
					<List>
						{channels.map(channel => (
							<div key={channel.id}>
								<ListItem component="div">
									<ListItemButton onClick={() => HandleClickChannel(channel)}>
										<Stack sx={{ width: "85%", height: 1}} alignItems="center" spacing={2} direction="row">
											{channel.private ? <LockIcon color="warning"/> : <LockOpenIcon color="warning"/>}
											<h4 style={{color: "white"}}>{channel.name}</h4>
										</Stack>
									</ListItemButton>
									<IconButton onClick={() => handleClickSettingsChannel(channel)} sx={{fontSize: "24px", color: "green", marginRight: "3%"}} aria-label="delete">
										<SettingsIcon style={{color: "#B8D2E5"}}/>
									</IconButton>
								</ListItem>
							</div>
						))}
					</List> : null
					}
				</Paper>
				{openSettingsAdmin && channelTmp !== undefined ? <SettingsAdmin channel={channelTmp} setOpenSettings={setOpenSettingsAdmin} reload={reload} setReload={setReload} me={me}/> : null}
				{openSettingsM && channelTmp !== undefined ? <SettingsM channel={channelTmp} setOpenSettings={setOpenSettingsM} me={me} setChannel={setChannel} channels={channels} setChannels={setChannels}/> : null}
			</Stack>
			<Stack direction="row" sx={{width: 1, height: 0.1}} alignItems="center" justifyContent="center" spacing={4}>
				<Button sx={buttonStyle} onClick={() => handleCreateChannel()}>Create new channel</Button>
				<Button sx={buttonStyle} onClick={() => handleJoinChannel()}>Join channel</Button>
			</Stack>
		</Stack>
	);
}

export default MyListChannels;