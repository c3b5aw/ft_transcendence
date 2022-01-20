import { Button, CircularProgress, IconButton, List, ListItem, ListItemButton, Paper, Stack } from '@mui/material';
import { api, apiChannel, apiChannels, apiUsers } from '../../../../services/Api/Api';
import { User } from '../../../../services/Interface/Interface';
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

function MyListChannels(props : {me: User, setChannel: Dispatch<SetStateAction<Channel | undefined>> }) {
	const { me, setChannel } = props;
	const [channels, setChannels] = useState<Channel[]>([]);
	const [open, setOpen] = useState<boolean>(false);
	const [openSettingsAdmin, setOpenSettingsAdmin] = useState<boolean>(false);
	const [openSettingsM, setOpenSettingsM] = useState<boolean>(false);
	const [channelTmp, setChannelTmp] = useState<Channel>();
	const [reload, setReload] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();

	const buttonStyle = {
		border: "4px solid black",
		borderRadius: "15px",
		color: "black",
		fontFamily: "Myriad Pro",
		padding: "15px",
		backgroundColor: "white",
		fontSize: "17px",
		'&:hover': {
			backgroundColor: '#D5D5D5',
			color: '#000000',
		},
	}

	useEffect(() => {
		const fetchChannels = async () => {
			try {
				const reponse = await axios.get(`${api}${apiChannels}`);
				setChannels(reponse.data);
			} catch (err) {
				enqueueSnackbar(`Impossible de charger la liste des channels (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchChannels();
	}, [me, reload, openSettingsAdmin, enqueueSnackbar])

	function handleCreateChannel() {
		setOpen(!open);
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
			{open ? <MyDialogCreateChannel reload={reload} setReload={setReload}/>: null}
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
				{openSettingsAdmin && channelTmp !== undefined ? <SettingsAdmin channel={channelTmp} setOpenSettings={setOpenSettingsAdmin} me={me}/> : null}
				{openSettingsM && channelTmp !== undefined ? <SettingsM channel={channelTmp} setOpenSettings={setOpenSettingsM} me={me}/> : null}
			</Stack>
			<Stack direction="column" sx={{width: 1, height: 0.1}} alignItems="center" justifyContent="center">
				<Button sx={buttonStyle} onClick={() => handleCreateChannel()}>Create new channel</Button>
			</Stack>
		</Stack>
	);
}

export default MyListChannels;