import { Avatar, CircularProgress, Divider, List, ListItem, Paper, Stack, TextField } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import SendIcon from '@mui/icons-material/Send';
import { MessageProps, UserProps } from "../utils/Interface";

const MyChat = (user: UserProps | undefined, connected: boolean, messages: MessageProps[]) => {
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
						<Avatar src={user?.avatar_url} sx={{margin: "3%", width: "64px", height: "64px"}}></Avatar>
						<h3>{user?.login}</h3>
					</Stack>
					{connected ? 
						<CircleIcon sx={{fontSize: "28px", color: "green", marginRight: "3%"}}></CircleIcon> :
						<CircleIcon sx=
						{{fontSize: "28px", color: "red", marginRight: "3%"}}></CircleIcon>}
				</Stack>
				<Divider />
				<Stack sx={{width: 1, height: 0.85, backgroundColor: "white"}} direction="column">
					<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto'}}>
						{ messages.length > 0 ?
							<List>
								{messages.map(message => (
									<div key={message.message}>
										<ListItem component="div">
											<Stack sx={{ width:1, height: 1}} direction="row">
												{message.to === "tom" ?
													<Stack sx={{ width: "100%", height: 1}}
														justifyContent="space-between"
														direction="column">
														<div style={{textAlign: "start" }}>
															<Stack direction="column" sx={{borderRadius: 3, marginRight: "30%", bgcolor: 'green' }}>
																<p style={{color: 'white', fontStyle: "normal", textAlign: "start", marginLeft: "5%", marginRight: "5%"}}>{message.message}</p>
															</Stack>
														</div>
													</Stack> :
													<Stack sx={{ width: "100%", height: 1}}
														justifyContent="flex-end"
														direction="column">
														<div style={{textAlign: "end"}}>
															<Stack direction="column" sx={{borderRadius: 3, marginLeft: "30%", bgcolor: 'orange' }}>
																<p style={{color: 'white', textAlign: "start", marginLeft: "5%", marginRight: "5%"}}>{message.message}</p>
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