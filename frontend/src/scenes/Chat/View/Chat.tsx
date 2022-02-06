import { Avatar, Box, Button, FormControl, IconButton, Stack, TextField, Typography } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import useMe from "../../../Services/Hooks/useMe";
import { styleTextField } from "../../../styles/Styles";
import MyListChannels from "../Components/Channels/MyListChannels";
import { Channel, IChannel, IListUser, Message } from "../Services/interface";
import SendIcon from '@mui/icons-material/Send';
import MyMessages from "../Components/MyMessages";
import { PAGE, User } from "../../../Services/Interface/Interface";
import MyListUser from "../Components/MyListUser";
import axios from "axios";
import { api, apiChannel, apiChannels, apiMessages, apiUsers } from "../../../Services/Api/Api";
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
import React from "react";

function Chat() {
	const me = useMe();
	const classes = styleTextField();
	const [messageTmp, setMessageTmp] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [usersChannel, setUsersChannel] = useState<User[]>([]);
	const [channels, setChannels] = useState<Channel[]>([]);
	const [nameChannel, setNameChannel] = useState<string>("");
	const [nameChannelDisplay, setNameChannelDisplay] = useState<string>("");

	const [open, setOpen] = useState<boolean>(false);
	const [openJoin, setOpenJoin] = useState<boolean>(false);
	const [openUserChannel, setOpenUserChannel] = useState<boolean>(false);

	const [uploadUsersChannel, setUploadUsersChannel] = useState(null)
	const [uploadMessagesChannel, setUploadMessagesChannel] = useState(null)
	const [uploadChannels, setUploadChannels] = useState("")

	const { enqueueSnackbar } = useSnackbar();

	const reinit = () => {
		setMessages([]);
		setUsersChannel([]);
		setNameChannel("");
	}

	const handleQuitChannel = (channel: Channel) => {
		channelLeave(channel);
		reinit();
	}

	const myChannels: IChannel = {
		channels: channels,
		setNameChannel: setNameChannel,
		handleQuitChannel: handleQuitChannel,
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
		})
		socket.on("channel::onMessage", (data) => {
			setUploadMessagesChannel(data)
		})
		socket.on("channel::onMembersReload", (data) => {
			setUploadUsersChannel(data)
		})
		socket.on("channel::onCreate", (data) => {
			setNameChannel(data.channel.name);
			channelJoin(data.channel.name, "");
		})
		socket.on("channel::onListReload", (data) => {
			setUploadChannels(data);
		})
		socket.on("channel::onRoleUpdate", (data) => {
			setUploadUsersChannel(data);
		})
		socket.on("channel::onKick", (data) => {
			setUploadChannels(data)
			reinit();
		})
	}, [])

	useEffect(() => {
		const fetchChannels = async () => {
			try {
				const response_channels_joined = await axios.get(`${api}${apiChannels}/joined`)
				setChannels(response_channels_joined.data.sort(function(c1: any, c2: any) {
					if (c1.tunnel && !c2.tunnel)
						return (-1);
					if (c1.private && !c2.private)
						return (-1);
					return (1);
				}));
			}
			catch (err: any) {
				enqueueSnackbar(`Error : ${err.error}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchChannels();
	}, [enqueueSnackbar, uploadChannels])
	
	/*
	** This useEffect will be used to join all channels at the beginning. Ideally,
	** we should have dont it in the backend
	*/
	useEffect(() => {
		const fetchChannels = async () => {
			try {
				const response_channels_joined = await axios.get(`${api}${apiChannels}/joined`)
				response_channels_joined.data.map((channel: { name: string; }) => (
					channelJoin(channel.name, "")
				));
			}
			catch (err: any) {
				console.log(err);
			}
		}
		fetchChannels();
	}, [])

	/*
	** RELOAD LIST OF MESSAGES FROM NAME_CHANNEL
	*/
	useEffect(() => {
		const fetchMessageChannel = async () => {
			try {
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
			fetchMessageChannel();
	}, [enqueueSnackbar, nameChannel, uploadMessagesChannel])


	/*
	** RELOAD LIST OF USERS IN NAME_CHANNEL
	*/
	useEffect(() => {
		const fetchUsersChannel = async () => {
			try {
				const response_users_channel = await axios.get(`${api}${apiChannel}/${nameChannel}${apiUsers}`)
				setUsersChannel(response_users_channel.data);
			}
			catch (err: any) {
				enqueueSnackbar(`Error : ${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		if (nameChannel !== "")
			fetchUsersChannel();
	}, [enqueueSnackbar, nameChannel, uploadUsersChannel])

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
			<MyFooter me={me} currentPage={PAGE.CHAT}/>
			<Stack direction="row" sx={{
				flexDirection: "row",
				height: 0.93,
				justifyCotent: "space-between"}}
			>
				<Stack sx={{
					height: 1,
					width: {xs: 0.3, sm: 0.3, md: 0.15, lg: 0.15, xl: 0.15},
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
								<h3 style={{color: "white"}}>{me.login}</h3>
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
					flexGrow={1}
					sx={{minWidth: 0.7, maxWidth: 0.7, height: 1}}
				>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						spacing={2}
						sx={{width: 0.95, height: 0.075}}
					>
						{nameChannel !== "" ?
							<React.Fragment>
								<Typography
									variant="h5"
									noWrap
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
							</React.Fragment> : null
						}
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
					display={{xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex"}}
					mb={2}
					flexDirection="column"
					height="90vh"
					minWidth={0.15}
					style={{
						overflow: "hidden",
						overflowY: "scroll"
					}}
				>
					<MyListUser myList={myListUsersChannel}/>
				</Box>
				{open ? <MyDialogCreateChannel setOpen={setOpen} /> : null}
				{openJoin ? <JoinChannel setOpen={setOpenJoin} /> : null}
				{openUserChannel ? <MyDialogListUser setOpen={setOpenUserChannel} myListUsersChannel={myListUsersChannel}/> : null}
			</Stack>
		</Box>
	);
}

export default Chat;