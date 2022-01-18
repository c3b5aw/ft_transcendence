import { Avatar, Button, Divider, FormControl, IconButton, Paper, Stack, TextField } from '@mui/material';
import React, { SetStateAction, useEffect, useState } from 'react';
import MyList from '../Components/MyListFriends';
import { api, apiChannel, apiFriends, apiUsers } from '../../../services/Api/Api';
import SendIcon from '@mui/icons-material/Send';
import { styleTextField } from '../../../styles/Styles';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import MyCreateChannel from '../Components/MyCreateChannel';
import useMe from '../../../services/Hooks/useMe';
import MyListChannels from '../Components/MyListChannels';
import MyMessages from '../Components/MyMessages';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Channel } from '../Services/interface';

function Chat() {
	const me = useMe();
	// const [channels, setChannels] = useState<Channel[]>([]);
	const [open, setOpen] = useState<boolean>();
	const [channel, setChannel] = useState<Channel>();
	const [message, setMessage] = useState<string>("");
	const [messageTmp, setMessageTmp] = useState<string>("");

	const classes = styleTextField()

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

	const  handleTextInputChange = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setMessageTmp(event.target.value);
	};

	function handleCreateChannel() {
		setOpen(!open);
	}

	function handleSendMessage() {
		console.log(messageTmp);
	}

	// eslint-disable-next-line eqeqeq
	if (me == undefined)
		return (<MyChargingDataAlert />);
	return (
		<Stack direction="column" sx={{width: 1, height: "100vh"}}>
			<Paper elevation={3} sx={{width: 1, height: 0.05, backgroundColor: '#394E51'}}>
				<Stack direction="row" alignItems="center" sx={{width: 1}}>
					<Stack sx={{width: 1.5/12}} direction="row" alignItems="center">
						<Avatar
							src={`http://127.0.0.1/api/profile/avatar`}
							sx={{marginLeft: "10px", marginRight: "10px", width: "40px", height: "40px"}}>
						</Avatar>
						<h3 style={{color: "white"}}>{me?.login}</h3>
					</Stack>
					<Divider orientation="vertical" flexItem />
					{channel != undefined ?
						<Stack sx={{width: 9/12}} direction="row" alignItems="center">
							{channel.private ? <LockIcon color="warning"/> : <LockOpenIcon color="warning"/>}
							<h3 style={{color: "white", fontFamily: "Myriad Pro", marginLeft: "10px"}}>{channel.name}</h3>
						</Stack> : null
					}
					<Divider orientation="vertical" flexItem />
					{channel != undefined ?
					<Stack sx={{width: 1.5/12}} direction="row" alignItems="center">
						<h3 style={{color: "white", marginLeft: "10px"}}>Users in {channel.name}</h3>
					</Stack> : null
					}
				</Stack>
			</Paper>
			<Stack direction="row" sx={{width: 1, height: 0.95}}>
				<Stack direction="column" sx={{width: 1.5/12, height: 1}}>
					<Stack direction="column" sx={{width: 1, height: 0.9}}>
						{/* load channels */}
						<MyListChannels me={me} setChannel={setChannel}/>
					</Stack>
					<Stack direction="column" sx={{width: 1, height: 0.1}} alignItems="center" justifyContent="center">
						<Button sx={buttonStyle} onClick={() => handleCreateChannel()}>Create new channel</Button>
					</Stack>
				</Stack>
				<Stack direction="column" sx={{width: 9/12, height: 1}} alignItems="center">
					{open ? <MyCreateChannel /> : null}
					{channel != undefined ? 
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
					{me != undefined && channel != undefined? <MyList me={me} url={`${api}${apiChannel}/${channel?.name}${apiUsers}`}/> : null}
					<h3 style={{fontFamily: "Myriad Pro", textAlign: "center"}}>My friends</h3>
					{me != undefined ? <MyList me={me} url={`${api}${apiUsers}/${me?.login}${apiFriends}`}/> : null}
				</Stack>
			</Stack>
		</Stack>
	);
}

export default Chat;