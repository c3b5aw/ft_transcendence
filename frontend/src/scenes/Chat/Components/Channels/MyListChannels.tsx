import { Box, IconButton, List, ListItem, ListItemButton, Paper, Stack, Tooltip } from '@mui/material';
import { User } from '../../../../Services/Interface/Interface';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Channel, IChannel, ISettingAdmin, ISettingM } from '../../Services/interface';
import SettingsM from './SettingsMember';
import { useState } from 'react';
import SettingsAdmin from './SettingsAdmin';

function MyListChannels(props : {myChannel: IChannel, me: User }) {
	const { myChannel, me } = props;
	const [mySettingsM, setMySettingsM] = useState<ISettingM>();
	const [mySettingsAdmin, setMySettingsAdmin] = useState<ISettingAdmin>();
	const [openAdmin, setOpenAdmin] = useState<boolean>(false);
	const [openM, setOpenM] = useState<boolean>(false);

	const handleClickChannel = (channel: Channel) => {
		myChannel.handleClickChannel(channel);
	}

	function handleClickSettingsChannelM(channel: Channel) {
		const mySettingsM: ISettingM = {
			channel: channel,
			open: true,
			isAdmin: false,
			closeModal: setOpenM,
			handleEnterChannel: myChannel.handleEnterChannel,
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
			updateListChannels: myChannel.updateListChannels,
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
				<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', backgroundColor: "#1d3033"}}>
					{myChannel.channels.length > 0 ?
					<List>
						{myChannel.channels.map(channel => (
							<div key={channel.id}>
								<ListItem component="div">
									<ListItemButton onClick={() => handleClickChannel(channel)}>
										<Stack
											sx={{ width: "85%", height: 1}}
											alignItems="center" spacing={2}
											direction="row"
										>
											<Tooltip title={`${channel.name}`}>
												{channel.private ? <LockIcon color="warning"/> : <LockOpenIcon color="warning"/>}
											</Tooltip>
											<Box sx={{display: { xs: 'none', sm: "flex" } }}>
												<h4 style={{color: "white"}}>{channel.name}</h4>
											</Box>
										</Stack>
									</ListItemButton>
									<Box sx={{display: { xs: 'none', md: 'none', lg: "flex"}}}>
										<DisplaySettings channel={channel}/>
									</Box>
								</ListItem>
							</div>
						))}
					</List> : <div style={{color: "grey", textAlign: "center", marginTop: "40%", fontFamily: "Myriad Pro", fontSize: "25px"}}>No channel</div>
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