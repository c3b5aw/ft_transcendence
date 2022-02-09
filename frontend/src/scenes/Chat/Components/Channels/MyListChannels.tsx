import { Box, IconButton, List, ListItem, ListItemButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { User } from '../../../../Services/Interface/Interface';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Channel, IChannel, ISettingAdmin, ISettingM } from '../../Services/interface';
import SettingsM from './SettingsMember';
import { Dispatch, SetStateAction, useState } from 'react';
import SettingsAdmin from './SettingsAdmin';
import { channelJoin } from '../../Services/wsChat';

function MyListChannels(props : {myChannel: IChannel, me: User, setOpen: Dispatch<SetStateAction<boolean>> }) {
	const { myChannel, me, setOpen } = props;
	const [mySettingsM, setMySettingsM] = useState<ISettingM>();
	const [mySettingsAdmin, setMySettingsAdmin] = useState<ISettingAdmin>();
	const [openAdmin, setOpenAdmin] = useState<boolean>(false);
	const [openM, setOpenM] = useState<boolean>(false);

	function handleClickSettingsChannelM(channel: Channel) {
		const mySettingsM: ISettingM = {
			channel: channel,
			open: true,
			isAdmin: false,
			closeModal: setOpenM,
			handleQuitChannel: myChannel.handleQuitChannel,
		};
		setOpenAdmin(false);
		setOpenM(true);
		setMySettingsM(mySettingsM);
	}

	function handleClickSettingsChannelAdmin(channel: Channel) {
		const mySettingsAdmin: ISettingAdmin = {
			channel: channel,
			open: true,
			isAdmin: true,
			closeModal: setOpenAdmin,
		};
		setOpenM(false);
		setOpenAdmin(true);
		setMySettingsAdmin(mySettingsAdmin);
	}

	function DisplaySettings(props: {channel: Channel}) {
		const { channel } = props;
		if (channel.owner_id === me.id && !channel.tunnel) {
			return (
				<IconButton
					onClick={() => handleClickSettingsChannelAdmin(channel)}
					sx={{fontSize: "24px", color: "green", marginRight: "3%"}}
					aria-label="delete"
				>
					<SettingsIcon style={{color: "#B8D2E5"}}/>
				</IconButton>
			);
		}
		else {
			return (
				<IconButton
					onClick={() => handleClickSettingsChannelM(channel)}
					sx={{fontSize: "24px", color: "green", marginRight: "3%"}}
					aria-label="delete"
				>
					<SettingsIcon style={{color: "#B8D2E5"}}/>
				</IconButton>
			);
		}
	}

	return (
		<Stack
			direction="column"
			sx={{width: 1, height: 1}}
		>
			<Stack
				direction="column"
				sx={{width: 1, height: 1, boxShadow: 3}}
			>
				<Paper elevation={0} style={{minHeight: 1, minWidth: 1, overflow: 'auto', backgroundColor: "#1d3033"}}>
					{myChannel.channels.length > 0 ?
					<List>
						{myChannel.channels.map(channel => (
							<ListItem key={channel.id} style={{paddingTop: 5, paddingBottom: 5, justifyContent: 'space-between'}}>
								<ListItemButton
									onClick={() => {
										if (window.innerWidth < 600)
											setOpen(true);
										myChannel.setNameChannel(channel.name);
										channelJoin(channel.name, "");
									}}
									sx={{minWidth: 0.85, maxWidth: 0.85}}	
								>
									<Stack
										sx={{ width: 0.85, height: 1}}
										alignItems="center"
										spacing={1}
										direction="row"
									>
										<Tooltip title={`${channel.name}`}>
											{channel.private ? <LockIcon color="error"/> : <LockOpenIcon color="success"/>}
										</Tooltip>
										<Box sx={{maxWidth: 0.85}}>
											<Typography
												noWrap
												variant="h6"
												style={{fontFamily: "Myriad Pro", color: "white"}}
											>
												{channel.name}
											</Typography>
										</Box>
									</Stack>
								</ListItemButton>
								<DisplaySettings channel={channel}/>
							</ListItem>
						))}
					</List> : <div style={{color: "grey", textAlign: "center", fontFamily: "Myriad Pro", fontSize: "25px"}}>No channel</div>
					}
				</Paper>
			</Stack>
			{	mySettingsM !== undefined && openM && !mySettingsM.isAdmin ? <SettingsM mySettingsM={mySettingsM} /> :
				mySettingsAdmin !== undefined && openAdmin && mySettingsAdmin.isAdmin ? <SettingsAdmin mySettingsAdmin={mySettingsAdmin} /> : null
			}
		</Stack>
	);
}

export default MyListChannels;