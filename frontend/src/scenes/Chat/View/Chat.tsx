import { Avatar, Button, FormControl, IconButton, List, ListItem, Paper, Stack, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import MyList from '../Components/MyListFriends';
import { api, apiFriends, apiUsers } from '../../../services/Api/Api';
import SendIcon from '@mui/icons-material/Send';
import { styleTextField } from '../../../styles/Styles';
import MyChargingDataAlert from '../../../components/MyChargingDataAlert';
import MyCreateChannel from '../Components/MyCreateChannel';
import useMe from '../../../services/Hooks/useMe';
import MyListChannels from '../Components/MyListChannels';

function Chat() {
	const me = useMe();
	// const [channels, setChannels] = useState<Channel[]>([]);
	const [open, setOpen] = useState<boolean>();
	const messageEl = useRef<HTMLDivElement>(null);

	const classes = styleTextField()

	useEffect(() => {
		const node = messageEl.current;
		if (node) {
			node.scrollIntoView({
				behavior: "auto",
				block: "end",
			});
		}
	  }, [me])

	const test: string[] = [
		"jfirjifjijrifjrijfr1",
		"jfirjifjijrifjrijfr2",
		"jfirjifjijrifjrijfr3",
		"jfirjifjijrifjrijfr4",
		"jfirjifjijrifjrijfr5",
		"jfirjifjijrifjrijfr6",
		"jfirjifjijrifjrijfr7",
		"jfirjifjijrifjrijfr8",
		"jfirjifjijrifjrijfr9",
		"jfirjifjijrifjrijfr11",
		"jfirjifjijrifjrijfr22",
		"jfirjifjijrifjrijfr33",
		"jfirjifjijrifjrijfr44",
		"jfirjifjijrifjrijfr55",
		"jfirjifjijrifjrijfr29",
		"jfirjifjijrifjrijfr77",
		"jfirjifjijrifjrijfr88",
		"jfirjifjijrifjrijfr99",
		"jfirjifjijrifjrijfr111",
		"jfirjifjijrifjrijfr222",
		"jfirjifjijrifjrijfr333",
		"jfirjifjijrifjrijfr444",
		"jfirjifjijrifjrijfr555",
		"jfirjifjijrifjrijfr666",
		"1jfirjifjijrifjrijfr666",
		"2jfirjifjijrifjrijfr666",
		"3jfirjifjijrifjrijfr666",
		"4jfirjifjijrifjrijfr666",
		"5jfirjifjijrifjrijfr666",
		"6jfirjifjijrifjrijfr666",
		"7jfirjifjijrifjrijfr666",
		"8jfirjifjijrifjrijfr666",
		"9jfirjifjijrifjrijfr666",
		"94jfirjifjijrifjrijfr666",
		"9jfi55rjifjijrifjrijfr666",
		"9jfir67jifjijrifjrijfr666",
		"9jfirjif8jijrifjrijfr666",
		"9jfirjifj5w5ijrifjrijfr666",
		"9jfirjif5w5tgjijrifjrijfr666",
		"9jfirjifjigrjrifjrijfr666",
		"9jfirjifjgijrifjrijfr666",
		"9jfirjifjijrggrifjrijfr666",
		"9jfirjifjijaarifjrijfr666",
		"9jfirjifjijuiirifjrijfr666",
		"9jfirjifjij0hyrifjrijfr666",
		"9jfirjifjij90rifjrijfr666",
		"9jfirjifjiojrifjrijfr666",
		"9jfirjifji0-ejrifjrijfr666",
		"9jfirjifjijrifwjrijfr666",
		"9jfirjifjijrtthifjrijfr666",
		"9jfirjifjtitrhq4jrifjrijfr666",
		"9jfirjifjijtshrifjrijfr666",
		"9jfirjifjijsta4rifjrijfr666",
		"9jfirjifjtijreata4ifjrijfr666",
		"9jfirjifjijri67fjrijfr666",
		"9jfirjifjijri7u7uwfjrijfr666",
		"9jfirjifjijriww5fjrijfr666",
	]

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

	function handleCreateChannel() {
		setOpen(!open);
	}

	// eslint-disable-next-line eqeqeq
	if (me == undefined)
		return (<MyChargingDataAlert />);
	return (
		<Stack direction="column" sx={{width: 1, height: "100vh"}}>
			<Paper elevation={3} sx={{width: 1, height: 0.05, backgroundColor: '#394E51'}}>
				<Stack direction="row" alignItems="center">
					<Avatar
						src={`http://127.0.0.1/api/profile/avatar`}
						sx={{marginLeft: "10px", marginRight: "10px", width: "40px", height: "40px"}}>
					</Avatar>
					<h3 style={{color: "white"}}>{me?.login}</h3>
				</Stack>
			</Paper>
			<Stack direction="row" sx={{width: 1, height: 0.95}}>
				<Stack direction="column" sx={{width: 2/12, height: 1}}>
					<Stack direction="column" sx={{width: 1, height: 0.9}}>
						{/* get channels */}
						<MyListChannels me={me}/>
					</Stack>
					<Stack direction="column" sx={{width: 1, height: 0.1}} alignItems="center" justifyContent="center">
						<Button sx={buttonStyle} onClick={() => handleCreateChannel()}>Create new channel</Button>
					</Stack>
				</Stack>
				<Stack direction="column" sx={{width: 8/12, height: 1}} alignItems="center">
					{open ? <MyCreateChannel /> : null}
					<Stack direction="column" sx={{width: 1, height: 0.91}}>
						<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', backgroundColor: "#304649"}} elevation={0}>
							{test.length > 0 ?
							<div ref={messageEl}>
								<List >
								{test.map(friend => (
									<div key={friend}>
										<ListItem component="div" sx={{marginBottom: 2}}>
											<Stack direction="row" alignItems="center" sx={{width: 1}}>
												<Stack sx={{ width: 1, height: 1}} alignItems="center" direction="row">
													<Stack direction="row" sx={{width: 1}}>
														<Stack direction="row" sx={{width: 0.05}} justifyContent="center">
															<Avatar
																src={`http://127.0.0.1/api/profile/avatar`}
																sx={{marginLeft: "10px", marginRight: "10px", width: "40px", height: "40px"}}>
															</Avatar>
														</Stack>
														<Stack direction="column" sx={{width: 0.9, maxWidth: 0.9}} spacing={1}>
															<div style={{fontSize: "18px", fontFamily: "Myriad Pro", color: "white"}}>{me?.login}</div>
															<div style={{color: "white"}}>{friend}</div>
														</Stack>
													</Stack>
												</Stack>
											</Stack>
										</ListItem>
									</div>
								))}
							</List>
							</div> : null
							}
						</Paper>
					</Stack>
					<Stack direction="row" sx={{width: 1, height: 0.09, backgroundColor: "#304649"}} spacing={2} alignItems="flex-start" justifyContent="space-between">
						<FormControl sx={{ width: 0.95, marginLeft: 4}}>
							<TextField
								className={classes.styleTextField}
								placeholder="Message"
								variant="outlined"
								fullWidth
								multiline
								maxRows={3}
								InputProps={{
									style: {
										backgroundColor: "#737373",
										color: "white",
									}
								}}
							/>
						</FormControl>
						<IconButton aria-label="send" size="large" sx={{color: "white"}}>
							<SendIcon fontSize="large" />
						</IconButton>
					</Stack>
				</Stack>
				<Stack direction="column" sx={{width: 2/12, height: 1}}>
					{/* get users in channel */}
					<MyList me={me} url={`${api}${apiUsers}/${me?.login}${apiFriends}`}/>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default Chat;