import { Avatar, CircularProgress, Divider, List, ListItem, Paper, Stack, TextField } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import SendIcon from '@mui/icons-material/Send';
import { Message, User } from "../services/Interface/Interface";
import { useEffect, useState } from "react";
import axios from "axios";
import { api, apiMe, apiMessages } from "../services/Api/Api";

const MyChat = (props: {user: User | undefined}) => {
	// eslint-disable-next-line eqeqeq
	const { user } = props;
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const response = await axios.get(`${api}${apiMe}${apiMessages}${user?.login}`)
				setMessages(response.data);
			} catch (err) {
				console.log(err);
			}
		}
		// eslint-disable-next-line eqeqeq
		if (user?.login != undefined)
			fetchMe();
	}, [user])

	// eslint-disable-next-line eqeqeq
	if (user == undefined || messages == undefined) {
		return (
			<Stack sx={{width: 0.2, height: "100vh"}} direction="column" alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}
	return (
		<Stack sx={{width: 0.2, height: "100vh"}} direction="column">
			<Stack direction="column" sx={{width: 1, height: "100vh", boxShadow: 3, borderTopLeftRadius: 11, borderTopRightRadius: 11}} alignItems="center">
				<Stack direction="row" sx={{width: 1, height: 1/12}} alignItems="center" justifyContent="space-between">
					<Stack direction="row" sx={{width: 1, height: 3/4}} alignItems="center">
						<Avatar src={`http://127.0.0.1/api/users/${user.login}/avatar`} sx={{margin: "3%", width: "64px", height: "64px"}}></Avatar>
						<h3>{user?.login}</h3>
					</Stack>
					{user.connected ? 
						<CircleIcon sx={{fontSize: "28px", color: "green", marginRight: "3%"}}></CircleIcon> :
						<CircleIcon sx={{fontSize: "28px", color: "red", marginRight: "3%"}}></CircleIcon>}
				</Stack>
				<Divider />
				<Stack sx={{width: 1, height: 0.85, backgroundColor: "white"}} direction="column">
					<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto'}}>
						{ messages.length > 0 ?
							<List>
								{messages.map(message => (
									<div key={message.description}>
										<ListItem component="div">
											<Stack sx={{ width:1, height: 1}} direction="row">
												{message.to === "tom" ?
													<Stack sx={{ width: "100%", height: 1}}
														justifyContent="space-between"
														direction="column">
														<div style={{textAlign: "start" }}>
															<Stack direction="column" sx={{borderRadius: 3, marginRight: "30%", bgcolor: 'green' }}>
																<p style={{color: 'white', fontStyle: "normal", textAlign: "start", marginLeft: "5%", marginRight: "5%"}}>{message.description}</p>
															</Stack>
														</div>
													</Stack> :
													<Stack sx={{ width: "100%", height: 1}}
														justifyContent="flex-end"
														direction="column">
														<div style={{textAlign: "end"}}>
															<Stack direction="column" sx={{borderRadius: 3, marginLeft: "30%", bgcolor: 'orange' }}>
																<p style={{color: 'white', textAlign: "start", marginLeft: "5%", marginRight: "5%"}}>{message.description}</p>
															</Stack>
														</div>
													</Stack>
												}
											</Stack>
										</ListItem>
									</div>
								))}
							</List> : null
						}
					</Paper>
				</Stack>
				<Stack sx={{backgroundColor: "white", width: 1, height: 0.15}} direction="row" justifyContent="space-between" alignItems="center">
					<TextField
						sx={{width: 0.9}}
						id="outlined-multiline-flexible"
						label="Message"
						multiline
						maxRows={3}
						focused
					/>
					<SendIcon sx={{marginRight:"3%"}} color="primary"></SendIcon>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default MyChat;