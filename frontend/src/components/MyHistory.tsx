import { Avatar, CircularProgress, Divider, List, ListItem, Paper, Stack } from "@mui/material"
import { useEffect, useState } from "react";
import { api, apiMatch, apiUsers } from "../services/Api/Api";
import axios from "axios";
import { Match, User } from "../services/Interface/Interface";

const MyHistory = (props: {user: User}) => {
	const { user } = props;
	const [matchs, setMatchs] = useState<Match[]>([]);

	useEffect(() => {
		const fetchMatchs = async () => {
			const response = await axios.get(`${api}${apiUsers}/${user.login}${apiMatch}`);
			setMatchs(response.data);
		}
		fetchMatchs();
	}, [user.login]);

	// eslint-disable-next-line eqeqeq
	if (matchs == undefined) {
		return (
			<Stack sx={{width: 1, height: "100vh"}} direction="column" alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}

	return (
		<Stack sx={{width: 1, height: "100vh"}} direction="column" alignItems="center" justifyContent="center" spacing={5}>
			<Stack direction="column" sx={{width: 1, height: 9/12}}>
			{ matchs.length > 0 ?
				<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', borderRadius: 40}}>
						<List>
							{matchs.map(match => (
								<div key={match.id}>
									<ListItem component="div">
										<Stack sx={{ width:1, height: 1}} direction="row">
											<Stack direction="row" sx={{width: 5.95/12, padding: '20px'}} spacing={2} justifyContent="center" alignItems="center">
												<Stack direction="row" sx={{width: 1/2}} alignItems="center" spacing={2}>
													<Avatar
														sx={{width: "64px", height: "64px"}}
														src={`http://127.0.0.1/api/users/${match.player_1_login}/avatar`}>
													</Avatar>
													<div style={{fontSize: "24px", fontFamily: "Myriad Pro"}}>{match.player_1_login}</div>
												</Stack>
												<Stack direction="row" sx={{width: 1/2}} justifyContent="flex-end">
												<div style={{
													fontSize: "32px",
													color: match.player_1_score > match.player_2_score ? "green" : match.player_1_score < match.player_2_score ? "#C70039" : "black",
													fontStyle: "bold",
													fontFamily: "Myriad Pro" }}>{match.player_1_score}
												</div>
												</Stack>
											</Stack>
											<Stack direction="row" sx={{width: 0.1/12, padding: '10px'}} alignItems="center" justifyContent="center">
												<h1>-</h1>
											</Stack>
											<Stack direction="row" sx={{width: 5.95/12, padding: '20px'}} alignItems="center">
												<Stack direction="row" sx={{width: 1/2}} justifyContent="flex-start">
													<div style={{
														fontSize: "32px",
														color: match.player_2_score > match.player_1_score ? "green" : match.player_2_score < match.player_1_score ? "#C70039" : "black",
														fontStyle: "bold",
														fontFamily: "Myriad Pro" }}>{match.player_2_score}
													</div>
												</Stack>
												<Stack direction="row" sx={{width: 1/2}} alignItems="center" justifyContent="flex-end" spacing={2}>
													<div style={{fontSize: "24px", fontFamily: "Myriad Pro"}}>{match.player_2_login}</div>
													<Avatar
														sx={{width: "64px", height: "64px"}}
														src={`http://127.0.0.1/api/users/${match.player_2_login}/avatar`}>
													</Avatar>
												</Stack>
											</Stack>
										</Stack>
									</ListItem>
									<Divider />
								</div>
							))}
						</List>
				</Paper> : <div style={{fontSize: "48px", color: "#A3A3A3", fontFamily: "Myriad Pro", textAlign: "center"}}>No matchs</div>
				}
			</Stack>
		</Stack>
	);
}

export default MyHistory;