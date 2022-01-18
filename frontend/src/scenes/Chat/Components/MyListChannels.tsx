import { CircularProgress, IconButton, List, ListItem, ListItemButton, Paper, Stack } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { useNavigate } from 'react-router';
import { apiStats } from '../../../services/Api/Api';
import { Channel, User } from '../../../services/Interface/Interface';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';

function MyListChannels(props : {me: User}) {
	const { me } = props;
	// const [channels, setChannels] = useState<Channel[]>([]);
	
	const navigate = useNavigate();

	const handleClick = (login: string) => {
		navigate(`${apiStats}/${login}`)
	}

	// useEffect(() => {
	// 	const fetchChannels = async () => {
	// 		try {
	// 			const reponse = await axios.get(`${url}`);
	// 			setChannels(reponse.data);
	// 		} catch (err) {
	// 			console.log(err);
	// 		}
	// 	}
	// 	fetchChannels();
	// }, [me, url])

	const channels: Channel[] = [
		{
			id: 1,
			name: "HELLO1"
		},
		{
			id: 2,
			name: "HELLO2"
		},
		{
			id: 3,
			name: "HELLO3"
		},
		{
			id: 4,
			name: "HELLO4"
		},
		{
			id: 5,
			name: "HELLO5"
		},
		{
			id: 6,
			name: "HELLO6"
		},
		{
			id: 7,
			name: "HELLO7"
		},
		{
			id: 8,
			name: "HELLO8"
		},
		{
			id: 9,
			name: "HELLO9"
		},
		{
			id: 10,
			name: "HELLO10"
		},
		{
			id: 11,
			name: "HELLO11"
		},
	];

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
									<ListItem component="div" disablePadding>
										<ListItemButton onClick={() => handleClick(channel.name)}>
											<Stack direction="row" alignItems="center" sx={{width: 1}}>
												<Stack sx={{ width: 1, height: 1}} alignItems="center" direction="row">
													<Stack sx={{ width: "85%", height: 1}} alignItems="center" spacing={2} direction="row">
														<h3 style={{color: "white"}}>{channel.name}</h3>
													</Stack>
												</Stack>
												<IconButton sx={{fontSize: "24px", color: "green", marginRight: "3%"}} aria-label="delete">
													<SettingsIcon />
												</IconButton>
											</Stack>
										</ListItemButton>
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