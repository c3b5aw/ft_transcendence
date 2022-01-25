import { Avatar, Button, FormControl, IconButton, Stack, TextField } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import useMe from "../../../Services/Hooks/useMe";
import { styleTextField } from "../../../styles/Styles";
import MyListChannels from "../Components/Channels/MyListChannels";
import { Channel, IChannel, IListUser, Message } from "../Services/interface";
import SendIcon from '@mui/icons-material/Send';
import NumbersIcon from '@mui/icons-material/Numbers';
import MyMessages from "../Components/MyMessages";
import { User } from "../../../Services/Interface/Interface";
import MyListUser from "../Components/MyListUser";
import axios from "axios";
import { api, apiChannel, apiChannels, apiFriends, apiMessages, apiUsers } from "../../../Services/Api/Api";
import { useSnackbar } from 'notistack'
import { channelJoin, channelLeave, channelSend } from "../Services/wsChat";
import { socket } from "../../../Services/ws/utils";
import MyDialogCreateChannel from "../Components/Channels/MyDialogCreateChannel";
import JoinChannel from "../Components/Channels/JoinChannel";

export const fetchChannelsJoin = async () => {
	let channelsJoined: Channel[] = [];
	try {
		const response = await axios.get(`${api}${apiChannels}/joined`);
		channelsJoined = response.data;
		return (channelsJoined);
	}
	catch (error) {
		return (channelsJoined);
	}
}

function Chat() {
	const me = useMe();
	const classes = styleTextField();
	const [messageTmp, setMessageTmp] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [usersChannel, setUsersChannel] = useState<User[]>([]);
	const [friends, setFriends] = useState<User[]>([]);
	const [channels, setChannels] = useState<Channel[]>([]);
	const [nameChannel, setNameChannel] = useState<string>("");
	const [nameChannelDisplay, setNameChannelDisplay] = useState<string>("");
	const [reload, setReload] = useState<boolean>(false);

	const [open, setOpen] = useState<boolean>(false);
	const [openJoin, setOpenJoin] = useState<boolean>(false);

	const [upload, setUpload] = useState(null)
	const [uploadChannels, setUploadChannels] = useState(null)

	const { enqueueSnackbar } = useSnackbar();

	const handleJoinChannel = (nameChannel: string) => {
		channelJoin(nameChannel, "");
	}

	const handleClickChannel = (channel: Channel) => {
		setNameChannel(channel.name);
		handleJoinChannel(channel.name);
	}

	const handleQuitChannel = (channel: Channel) => {
		channelLeave(channel);
		updateListChannels();
	}

	const handleEnterChannel = (channel: Channel, password: string) => {
		channelJoin(channel.name, password);
	}

	function updateListChannels() {
		setReload(!reload);
	}

	const myChannels: IChannel = {
		channels: channels,
		handleClickChannel: handleClickChannel,
		handleEnterChannel: handleEnterChannel,
		handleQuitChannel: handleQuitChannel,
		updateListChannels: updateListChannels,
	}

	const handleLaunchParametres = () => {
		console.log("GO TO PARAMS");
	}

	function HandleCreateChannel() {
		return (
			<Button variant="contained" 
			sx={{backgroundColor: "white",
				color: "black",
				fontFamily: "Myriad Pro"
			}} onClick={() => setOpen(true)}>
			Create new channel</Button>
		);
	}

	function HandleJoinChannel() {
		return (
			<Button variant="contained" 
			sx={{backgroundColor: "white",
				color: "black",
				fontFamily: "Myriad Pro"
			}} onClick={() => setOpenJoin(true)}>
			Join new channel</Button>
		);
	}

	const  handleTextInputChange = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setMessageTmp(event.target.value);
	};

	function handleSendMessage() {
		channelSend(nameChannel, messageTmp);
		setMessageTmp("");
	}

	useEffect(() => {
		socket.on("channel::onJoin", (data) => {
			setUploadChannels(data)
		})
	}, [])

	useEffect(() => {
		socket.on("channel::onMembersReload", (data) => {
			setUpload(data)
		})
	}, [])

	useEffect(() => {
		socket.on("channel::onMessage", (data) => {
			setUpload(data)
		})
	}, [])

	useEffect(() => {
		socket.on("channel::onListReload", (data) => {
			setUploadChannels(data)
		})
	}, [])

	useEffect(() => {
		const fetchChannels = async () => {
			try {
				const response_channels_joined = await axios.get(`${api}${apiChannels}/joined`)
				setChannels(response_channels_joined.data);
			}
			catch (err: any) {
				enqueueSnackbar(`Error : ${err.response.data.error}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchChannels();
	}, [enqueueSnackbar, uploadChannels, reload])

	useEffect(() => {
		const fetchChat = async () => {
			try {
				const response_users_channel = await axios.get(`${api}${apiChannel}/${nameChannel}${apiUsers}`)
				setUsersChannel(response_users_channel.data);

				const response_message = await axios.get(`${api}${apiChannel}/${nameChannel}${apiMessages}`)
				setMessages(response_message.data);
				setNameChannelDisplay(nameChannel);
			}
			catch (err: any) {
				enqueueSnackbar(`Error : ${err.response.data.error}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		if (nameChannel !== "")
			fetchChat();
	}, [enqueueSnackbar, nameChannel, upload])

	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const response_friends = await axios.get(`${api}${apiUsers}/${me?.login}${apiFriends}`)
				setFriends(response_friends.data);
			}
			catch (err: any) {
				enqueueSnackbar(`Error : ${err.response.data.error}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		if (me !== undefined)
			fetchFriends();
	}, [enqueueSnackbar, me])

	var myListFriends: IListUser = {
		users: friends,
		name_list: "List Friends",
		isListChannel: false,
		name_channel: nameChannel,
	}

	var myListUsersChannel: IListUser = {
		users: usersChannel,
		name_list: "List Users Channel",
		isListChannel: true,
		name_channel: nameChannel,
	}

	return (
		<Stack direction="row" sx={{width: 1, height: "100vh"}}>
			<Stack direction="column" sx={{width: 0.15, height: 1}}>
				<Stack direction="row" sx={{width: 1, height: 0.075}}>
					<Stack direction="row" alignItems="center" onClick={() => handleLaunchParametres()}>
						<Avatar
							src={`http://127.0.0.1/api/profile/avatar`}
							sx={{marginLeft: "10px", marginRight: "10px", width: "40px", height: "40px"}}>
						</Avatar>
						<h3 style={{color: "white"}}>{me?.login}</h3>
					</Stack>
				</Stack>
				<Stack direction="column" sx={{width: 1, height: 0.8}}>
					{me !== undefined ? <MyListChannels myChannel={myChannels} me={me}/> : null}
				</Stack>
				<Stack direction="row" sx={{width: 1, height: 0.125 }} spacing={2} alignItems="center">
					<HandleCreateChannel />
					<HandleJoinChannel />
				</Stack>
			</Stack>
			<Stack direction="column" sx={{width: 0.7, height: 1}}>
				<Stack direction="row" sx={{width: 1, height: 0.075}}>
					{nameChannel !== "" ?
						<Stack direction="row" alignItems="center" spacing={1}>
							<NumbersIcon style={{fontSize: "40px"}} color="warning"/>
							<h2 style={{color: "white", fontFamily: "Myriad Pro"}}>{nameChannelDisplay}</h2>
						</Stack> : null
					}
				</Stack>
				<Stack direction="row" sx={{width: 1, height: 0.8, backgroundColor: "#304649"}} spacing={2} alignItems="flex-start" justifyContent="space-between">
					<MyMessages messages={messages} />
				</Stack>
				<Stack direction="row" sx={{width: 1, height: 0.125, backgroundColor: "#304649"}} spacing={2} alignItems="center" justifyContent="space-between">
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
			</Stack>
			<Stack direction="column" sx={{width: 0.15, height: 1}}>
				<MyListUser myList={myListUsersChannel}/>
				<MyListUser myList={myListFriends}/>
			</Stack>
			{open ? <MyDialogCreateChannel reload={reload} setReload={setReload} setOpen={setOpen}/> : null}
			{openJoin ? <JoinChannel setOpen={setOpenJoin}/> : null}
		</Stack>
	);
}

export default Chat;