import { CircularProgress, IconButton, List, ListItem, ListItemButton, Paper, Stack } from '@mui/material';
import { api, apiChannels } from '../../../services/Api/Api';
import { User } from '../../../services/Interface/Interface';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Channel } from '../Services/interface';

function MyListChannels(props : {me: User, setChannel: Dispatch<SetStateAction<Channel | undefined>>}) {
	const { me, setChannel } = props;
	const [channels, setChannels] = useState<Channel[]>([]);
	
	const handleClick = (channel: Channel) => {
		setChannel(channel);
	}

	useEffect(() => {
		const fetchChannels = async () => {
			try {
				const reponse = await axios.get(`${api}${apiChannels}`);
				setChannels(reponse.data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchChannels();
	}, [me])

	// eslint-disable-next-line eqeqeq
	if (me == undefined)
	{
		return (
			<Stack direction="column" sx={{width: 1, height: "100vh"}} alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}
	return (
		<Stack direction="column" sx={{width: 1, height: "100vh", boxShadow: 3, borderTopLeftRadius: 11, borderTopRightRadius: 11}} alignItems="center">
			<Stack sx={{width: 1, height: 1}} direction="column">
				<Stack sx={{backgroundColor: "#1d3033", width: 1, height: 1}} direction="column">
					<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', backgroundColor: "#1d3033"}}>
						{channels.length > 0 ?
						<List>
							{channels.map(channel => (
								<div key={channel.id}>
									<ListItem component="div">
										<ListItemButton onClick={() => handleClick(channel)}>
											<Stack sx={{ width: "85%", height: 1}} alignItems="center" spacing={2} direction="row">
												{channel.private ? <LockIcon color="warning"/> : <LockOpenIcon color="warning"/>}
												<h4 style={{color: "white"}}>{channel.name}</h4>
											</Stack>
										</ListItemButton>
										<IconButton sx={{fontSize: "24px", color: "green", marginRight: "3%"}} aria-label="delete">
											<SettingsIcon color="info"/>
										</IconButton>
									</ListItem>
								</div>
							))}
						</List> : null
						}
					</Paper>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default MyListChannels;