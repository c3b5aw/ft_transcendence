import { Avatar, Box, Button, FormControl, IconButton, Stack, TextField, Typography } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import useMe from "../../../Services/Hooks/useMe";
import { styleTextField } from "../../../styles/Styles";
import MyListChannels from "../Components/Channels/MyListChannels";
import { Channel, IChannel, IListUser, Message } from "../Services/interface";
import SendIcon from '@mui/icons-material/Send';
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
import { ROLE } from "../../../Services/Api/Role";
import { isMuteSendMessage } from "../Services/utils";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import MyFooter from "../../../components/MyFooter";
import MyDialogListUser from "../Components/MyDialogListUser";
import MyDialogListFriend from "../Components/MyDialogListFriend";

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
	const [openUserChannel, setOpenUserChannel] = useState<boolean>(false);
	const [openFriend, setOpenFriend] = useState<boolean>(false);

	const [upload, setUpload] = useState(null)
	const [uploadChannels, setUploadChannels] = useState("")

	const { enqueueSnackbar } = useSnackbar();

	const reinit = () => {
		setMessages([]);
		setUsersChannel([]);
		setNameChannel("");
		updateListChannels();
	}

	const handleQuitChannel = (channel: Channel) => {
		channelLeave(channel);
		reinit();
	}

	function updateListChannels() {
		setReload(!reload);
	}

	const myChannels: IChannel = {
		channels: channels,
		handleQuitChannel: handleQuitChannel,
		updateListChannels: updateListChannels,
	}

	function HandleCreateChannel() {
		return (
			<Button variant="contained" 
				sx={{backgroundColor: "green",
					color: "white",
					fontFamily: "Myriad Pro"
				}} onClick={() => setOpen(true)}>
				<Typography variant="body1" style={{fontFamily: "Myriad Pro"}}>Create</Typography>
			</Button>
		);
	}

	function HandleJoinChannel() {
		return (
			<Button variant="contained" 
				sx={{color: "white",
					fontFamily: "Myriad Pro"
				}} onClick={() => setOpenJoin(true)}>
				<Typography variant="body1" style={{fontFamily: "Myriad Pro"}}>Join</Typography>
			</Button>
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
			setOpenJoin(false);
			setNameChannel(data.name);
		})
	}, [])

	useEffect(() => {
		socket.on("channel::onMembersReload", (data) => {
			setUpload(data)
		})
	}, [])

	useEffect(() => {
		socket.on("channel::onListReload", (data) => {
			if (data !== undefined && data.channel !== undefined)
				channelJoin(data.channel.name, "");
			else {
				setUploadChannels(data);
			}
		})
	}, [])

	useEffect(() => {
		socket.on("channel::onKick", (data) => {
			reinit();
			setUploadChannels(data)
		})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		socket.on("channel::onMessage", (data) => {
			setUpload(data)
		})
	}, [])

	/*
	** RELOAD LIST OF CHANNELS
	*/
	useEffect(() => {
		const fetchChannels = async () => {
			try {
				const response_channels_joined = await axios.get(`${api}${apiChannels}/joined`)
				setChannels(response_channels_joined.data);
			}
			catch (err: any) {
				enqueueSnackbar(`Error : ${err.error}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchChannels();
	}, [enqueueSnackbar, uploadChannels, reload, nameChannel])

	/*
	** RELOAD LIST OF USERS IN NAME_CHANNEL
	** RELOAD LIST OF MESSAGES FROM NAME_CHANNEL
	*/
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
				enqueueSnackbar(`Error : ${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		if (nameChannel !== "")
			fetchChat();
	}, [enqueueSnackbar, nameChannel, upload])

	/*
	** RELOAD LIST OF FRIENDS
	*/
	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const response_friends = await axios.get(`${api}${apiUsers}/${me?.login}${apiFriends}`)
				setFriends(response_friends.data);
			}
			catch (err: any) {
				enqueueSnackbar(`Error : ${err}`, { 
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
	if (me === undefined) {
		return (<MyChargingDataAlert />);
	}
	return (
		<Box sx={{
			flexDirection: "column",
			height: "100vh",
			justifyContent: 'space-between'}}
		>
			<MyFooter me={me}/>
			<Box sx={{
				flexDirection: "row",
				height: "90vh",
				display: "flex"}}
			>
				<Stack sx={{
					height: 1,
					width: 0.25,
					alignItems: "center"}}
				>
					<Stack
						direction="row"
						sx={{width: 1, height: 0.075}}
						justifyContent={{xs: "center", sm: "flex-start"}}
					>
						<Stack
							direction="row"
							alignItems="center"
						>
							<Avatar
								src={`/api/profile/avatar`}
								sx={{marginLeft: "10px", marginRight: "10px", width: "40px", height: "40px"}}>
							</Avatar>
							<Box sx={{display: { xs: 'none', sm: 'flex'}}}>
								<h3 style={{color: "white"}}>{me?.login}</h3>
							</Box>
						</Stack>
					</Stack>
					<Stack
						direction="column"
						sx={{width: 1, height: 0.73}}
					>
						{me !== undefined ? <MyListChannels myChannel={myChannels} me={me}/> : null}
					</Stack>
					<Stack
						direction={{ xs: 'column', sm: 'column', md: 'column', lg: 'row' }}
						sx={{width: 1, height: 0.125 }}
						alignItems="center"
						justifyContent="space-around"
					>
						<HandleCreateChannel />
						<HandleJoinChannel />
					</Stack>
				</Stack>
				<Stack
					direction="column"
					sx={{minWidth: 0.7, maxWidth: 0.7, height: 1}}
				>
					<Stack
						direction="row"
						sx={{width: 1, height: 0.075}}
						spacing={3}
					>
						{nameChannel !== "" ?
							<Stack
								direction="row"
								alignItems="center"
								spacing={3}
							>
								<Typography
									variant="h5"
									style={{fontFamily: "Myriad Pro", textAlign: "center"}}
									>
										{nameChannelDisplay}
									</Typography>
								<Button
									sx={{display: {lg: "flex", xl: "none"}}}
									variant="contained"
									onClick={() => setOpenUserChannel(true)}
								>
									<Typography
										variant="subtitle1"
										style={{fontFamily: "Myriad Pro"}}
									>
											Users
									</Typography>
								</Button>
							</Stack> : null
						}
						<Stack
							direction="row"
							alignItems="center"
							spacing={3}
						>
							<Button
								sx={{display: {xs: "flex", sm: "flex", md: "flex", lg: "flex", xl: "none"}}}
								variant="contained"
								onClick={() => setOpenFriend(true)}
							>
								<Typography
									variant="subtitle1"
									style={{fontFamily: "Myriad Pro"}}
								>
									Friends
								</Typography>
							</Button>
						</Stack>
					</Stack>
					<Stack
						direction="row"
						sx={{width: 1, height: 0.73, backgroundColor: "#304649"}}
						spacing={2}
						alignItems="flex-start"
						justifyContent="space-between"
					>
						{me !== undefined && me.role !== ROLE.BANNED ?
							<MyMessages messages={messages} /> : 
							<div style={{
								color: "grey",
								textAlign: "center",
								marginTop: "40%",
								fontFamily: "Myriad Pro",
								fontSize: "45px"}}
							>
								You have been banned
							</div>
						}
					</Stack>
					<Stack
						direction="row"
						sx={{width: 1, height: 0.125, backgroundColor: "#304649"}}
						spacing={2}
						alignItems="center"
						justifyContent="space-between"
					>
						<Stack
							direction="row"
							sx={{width: 1, marginTop: 3}}
						>
							<FormControl sx={{ width: 0.95, marginLeft: 4}}>
								<TextField
									disabled={me !== undefined && isMuteSendMessage(usersChannel, me, messageTmp) ? true : false}
									className={classes.styleTextField}
									placeholder="Message"
									variant="outlined"
									fullWidth
									maxRows={2}
									value={messageTmp}
									onChange={handleTextInputChange}
									InputProps={{
										style: {
											backgroundColor: "#737373",
											color: "white",
										}
									}}
									onKeyPress= {(e) => {
										if (e.key === 'Enter') {
											handleSendMessage();
										}
									}}
								/>
							</FormControl>
							<IconButton
								aria-label="send"
								size="large"
								sx={{color: "white"}}
								onClick={() => handleSendMessage()}
							>
								<SendIcon fontSize="large" />
							</IconButton>
						</Stack>
					</Stack>
				</Stack>
				<Box
					display={{xs: "none", sm: "none", md: "none", lg: "none", xl: "flex"}}
					mb={2}
					flexDirection="column"
					height="90vh"
					width="15vw"
					style={{
						overflow: "hidden",
						overflowY: "scroll"
					}}
				>
					<MyListUser myList={myListUsersChannel}/>
					<MyListUser myList={myListFriends}/>
				</Box>
				{open ? <MyDialogCreateChannel setOpen={setOpen} /> : null}
				{openJoin ? <JoinChannel setOpen={setOpenJoin} /> : null}
				{openUserChannel ? <MyDialogListUser setOpen={setOpenUserChannel} myListUsersChannel={myListUsersChannel}/> : null}
				{openFriend ? <MyDialogListFriend setOpen={setOpenFriend} myListFriends={myListFriends}/> : null}
			</Box>
		</Box>
	);
}

export default Chat;