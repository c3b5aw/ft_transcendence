import { Avatar, FormControl, IconButton, List, ListItem, Paper, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import MyList from '../components/MyList';
import { api, apiFriends, apiMe, apiUsers } from '../services/Api/Api';
import { User } from '../services/Interface/Interface';
import SendIcon from '@mui/icons-material/Send';
import { styleTextField } from '../styles/Styles';
import MyChargingDataAlert from '../components/MyChargingDataAlert';
import MyError from '../components/MyError';

function Chat() {
	const [me, setMe] = useState<User>();
	// const [channels, setChannels] = useState<Channel[]>([]);
	const [error, setError] = useState<unknown>("");

	const classes = styleTextField()

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
	]

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
			} catch (err) {
				setError(err);
			}
		}
		fetchMe();
	}, [])

	// useEffect(() => {
	// 	const fetchChannel = async () => {
	// 		try {
	// 			const reponse = await axios.get(`${api}${apiChat}${apiChannels}`);
	// 			setChannels(reponse.data);
	// 		} catch (err) {
	// 			console.log(err);
	// 		}
	// 	}
	// 	fetchChannel();
	// }, [])
	// eslint-disable-next-line eqeqeq
	if (me == undefined && error === "")
		return (<MyChargingDataAlert />);
	else if (error !== "")
		return (<MyError error={error}/>);
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
					{/* get channels */}
					<MyList me={me} url={`${api}${apiUsers}/${me?.login}${apiFriends}`}/>
				</Stack>
				<Stack direction="column" sx={{width: 8/12, height: 1}} alignItems="center">
					<Stack direction="column" sx={{width: 1, height: 0.91}}>
						<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', backgroundColor: "#304649"}} elevation={0}>
							{test.length > 0 ?
							<List>
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
							</List> : null
							}
					</Paper>
					</Stack>
					<Stack direction="row" sx={{width: 1, height: 0.09, backgroundColor: "#304649"}} spacing={2} alignItems="flex-start" justifyContent="space-between">
						<FormControl sx={{ width: 0.95, marginLeft: 4}}>
							<TextField
								className={classes.searchBarStyle}
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