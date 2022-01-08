import { Avatar, Button, Divider, List, ListItem, Paper, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { avatarStyle } from '../styles/Styles';
import SendIcon from '@mui/icons-material/Send';
import { MatchPropsTmp, MessageProps, UserListProps } from '../utils/Interface';
import CircleIcon from '@mui/icons-material/Circle';

const StatsPage = (props: UserListProps) => {
	const { login } = useParams();
	const user = (props.items).find(e => e.login === login);
	const connected = true;
	const [value, setValue] = useState();

	const [matchs, setMatchs] = useState<MatchPropsTmp[]>([]);
	console.log(user);

	const testMessageList: MessageProps[] = [
		{ message: "Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas", to:"tom" },
		{ message: "12", to:"tom" },
		{ message: "elie1", to:"elie" },
		{ message: "14", to:"tom"},
		{ message: "15", to:"tom" },
		{ message: "elie2", to:"elie" },
		{ message: "elie3", to:"elie" },
		{ message: "elie4", to:"elie" },
		{ message: "1u", to:"tom" },
		{ message: "17u", to:"tom" },
		{ message: "elie", to:"elie" },
		{ message: "17grg", to:"tom" },
		{ message: "elie6", to:"elie" },
		{ message: "17qew", to:"tom" },
		{ message: "Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout casBonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas Bonjour tout le monde comment allez vous aujourdhui moi je vais tres bien en tout cas", to:"elie" },
		{ message: "18de", to:"tom" },
		{ message: "elie8", to:"elie" },
		{ message: "elie9", to:"elie" },
		{ message: "1rgffr", to:"tom" },
		{ message: "17hhgrg", to:"tom" },
		{ message: "elie10", to:"elie" },
		{ message: "elie11", to:"elie" },
	];

	const [messages, setMessages] = useState<MessageProps[]>(testMessageList);

	useEffect(() => {
		const fetchMatchs = async () => {
			try {
				if (user)
				{
					const len = user.login.length + 39;
					const following_url = user.following_url.substring(0, len);
					console.log(following_url);
					const reponse = await axios.get(`${following_url}`);
					setMatchs(reponse.data);
				}
			} catch (err) {
				console.log(err);
			}
		}
		fetchMatchs();
	}, [user])

	const test = 0;
	return (
	   <Stack sx={{width: 1, height: 1}} direction="row">
		   <Stack sx={{ width: 0.2, height: "100vh" }} direction="column" alignItems="center">
		   		<Stack sx={{ width: 1, height: 1/4 }} direction="column" alignItems="center" justifyContent="center" spacing={3}>
				   <Avatar
						src={user?.avatar_url}
						sx={{ width: "126px", height: "126px" }}>
					</Avatar>
					<h2>{user?.login}</h2>
					<h3 style={{ color: 'grey' }}>Join le 03/01/2022</h3>
				</Stack>
				<Stack sx={{ width: 1, height: 1/4, marginLeft: "30%" }} direction="column" justifyContent="center" spacing={4}>
					<h2>Matchs joués : {matchs[0]?.id}</h2>
					<h2>Classement {matchs[1]?.id}</h2>
					<h2 style={{color: '#079200'}}>Victoires : {matchs[2]?.id}</h2>
					<h2 style={{color: '#C70039'}}>Défaites : {matchs[3]?.id}</h2>
				</Stack>
				<Stack sx={{ marginTop: "15%", width: 0.90, height: 0.4, backgroundColor: 'white', borderRadius: 7 }} direction="column">
					<Stack direction="row" alignItems="center" justifyContent="space-between">
						<h2 style={{ marginLeft: '11px', fontFamily: "Myriad Pro", color:'black' }}>Achievements</h2>
						<h2 style={{ marginRight: '11px', fontFamily: "Myriad Pro", color:'black' }}>{matchs.length} / 12</h2>
					</Stack>
					<Divider />
					<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto'}}>
						{ matchs.length > 0 ?
							<List>
								{matchs.map(match => (
									<div key={match.id}>
										<ListItem component="div" disablePadding>
											<Stack direction="row">
												<Stack sx={{ width: 1, height: 1}} alignItems="center" direction="row">
													<Stack sx={{ width: "85%", height: 1}}
														alignItems="center"
														spacing={2}
														direction="row">
														<Avatar sx={avatarStyle} src=""></Avatar>
														<h2>{match.login}</h2>
													</Stack>
												</Stack>
											</Stack>
										</ListItem>
										<Divider sx={{marginBottom: "5px", marginTop: "5px"}}/>
									</div>
								))}
							</List> : null
						}
					</Paper>
				</Stack>
		   </Stack>
		   <Stack sx={{width: 0.6, height: "100vh"}} direction="column">
		   		<Button>Hello 2</Button>
		   </Stack>
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
							value={value}
							focused
						/>
						<SendIcon sx={{marginRight:"3%"}} color="primary"></SendIcon>
					</Stack>
				</Stack>
		   </Stack>
	   </Stack>
	);
}

export default StatsPage;
