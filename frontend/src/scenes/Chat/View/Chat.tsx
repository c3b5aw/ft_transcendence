import { Avatar, Divider, FormControl, IconButton, Paper, Stack, TextField } from '@mui/material';
import React, { SetStateAction, useState } from 'react';
import MyList from '../Components/MyListFriends';
import { api, apiChannel, apiFriends, apiUsers } from '../../../Services/Api/Api';
import SendIcon from '@mui/icons-material/Send';
import { styleTextField } from '../../../styles/Styles';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import useMe from '../../../Services/Hooks/useMe';
import MyListChannels from '../Components/Channels/MyListChannels';
import MyMessages from '../Components/MyMessages';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Channel } from '../Services/interface';
import { channelSend } from '../Services/wsChat';

function Chat() {
	const me = useMe();
	const [channel, setChannel] = useState<Channel>();
	const [messageTmp, setMessageTmp] = useState<string>("");
	const classes = styleTextField();

	const  handleTextInputChange = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setMessageTmp(event.target.value);
	};

	function handleSendMessage() {
		if (channel !== undefined)
		{
			channelSend(channel, messageTmp);
			setMessageTmp("");
		}
	}

	if (me === undefined)
		return (<MyChargingDataAlert />);
	return (
		<Stack direction="column" sx={{width: 1, height: "100vh"}}>
			<Paper elevation={3} sx={{width: 1, height: 0.05, backgroundColor: '#394E51'}}>
				<Stack direction="row" alignItems="center" sx={{width: 1}}>
					<Stack sx={{width: 1.5/12}} direction="row" alignItems="center" justifyContent="space-between">
						<Stack direction="row" alignItems="center">
							<Avatar
								src={`http://127.0.0.1/api/profile/avatar`}
								sx={{marginLeft: "10px", marginRight: "10px", width: "40px", height: "40px"}}>
							</Avatar>
							<h3 style={{color: "white"}}>{me?.login}</h3>
						</Stack>
					</Stack>
					<Divider orientation="vertical" flexItem />
					{channel !== undefined ?
						<Stack sx={{width: 9/12}} direction="row" alignItems="center">
							{channel.private ? <LockIcon color="warning"/> : <LockOpenIcon color="warning"/>}
							<h3 style={{color: "white", fontFamily: "Myriad Pro", marginLeft: "10px"}}>{channel.name}</h3>
						</Stack> : null
					}
					<Divider orientation="vertical" flexItem />
					{channel !== undefined ?
					<Stack sx={{width: 1.5/12}} direction="row" alignItems="center">
						<h3 style={{color: "white", marginLeft: "10px"}}>Users in {channel.name}</h3>
					</Stack> : null
					}
				</Stack>
			</Paper>
			<Stack direction="row" sx={{width: 1, height: 0.95}}>
				<MyListChannels me={me} setChannel={setChannel}/>
				<Stack direction="column" sx={{width: 9/12, height: 1}} alignItems="center">
					{channel !== undefined ? 
						<React.Fragment>
							{/* load messages */}
							<MyMessages nameChannel={channel.name}/>
							<Stack direction="row" sx={{width: 1, height: 0.1, backgroundColor: "#304649"}} spacing={2} alignItems="flex-start" justifyContent="space-between">
								<Stack direction="row" sx={{width: 1, marginTop: 3}}>
									<FormControl sx={{ width: 0.95, marginLeft: 4}}>
										<TextField
											className={classes.styleTextField}
											placeholder="Message"
											variant="outlined"
											fullWidth
											multiline
											maxRows={3}
											value={messageTmp}
											onChange={handleTextInputChange}
											InputProps={{
												style: {
													backgroundColor: "#737373",
													color: "white",
												}
											}}
										/>
									</FormControl>
									<IconButton aria-label="send" size="large" sx={{color: "white"}} onClick={() => handleSendMessage()}>
										<SendIcon fontSize="large" />
									</IconButton>
								</Stack>
							</Stack>
						</React.Fragment> : null
					}
				</Stack>
				<Stack direction="column" sx={{width: 1.5/12, height: 1}}>
					{/* load user in channel */}
					{me !== undefined && channel !== undefined ? 
						<MyList me={me} url={`${api}${apiChannel}/${channel?.name}${apiUsers}`} isListUserChannel={true} channel={channel}/>
						: null}
					<h3 style={{fontFamily: "Myriad Pro", textAlign: "center"}}>My friends</h3>
					{me !== undefined ?
						<MyList me={me} url={`${api}${apiUsers}/${me?.login}${apiFriends}`} isListUserChannel={false}/>
						: null}
				</Stack>
			</Stack>
		</Stack>
	);
}

export default Chat;