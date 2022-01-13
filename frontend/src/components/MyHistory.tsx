import { Avatar, Button, CircularProgress, Divider, List, ListItem, Paper, Stack } from "@mui/material"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from "react";
import { apiMatch } from "../services/Api/Api";
import axios from "axios";
import { Match } from "../services/Interface/Interface";

const MyHistory = () => {

	const [matchs, setMatchs] = useState<Match[]>([]);

	useEffect(() => {
		const fetchMatchs = async () => {
			const response = await axios.get(`${apiMatch}`);
			setMatchs(response.data);
		}
		fetchMatchs();
	}, []);

	// eslint-disable-next-line eqeqeq
	if (matchs == undefined) {
		return (
			<Stack sx={{width: 1, height: "100vh"}} direction="column" alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}

	return (
		<Stack sx={{width: 1, height: "100vh"}} direction="column" alignItems="center" spacing={5}>
			<Stack sx={{width: 0.85, height: 2/12}} direction="row" alignItems="flex-end" justifyContent="flex-end" spacing={4}>
				<Button sx={{borderRadius: 2}} variant="contained" startIcon={<PersonAddIcon />}>
					<div style={{margin: "5px", padding: "3px", fontFamily: "Myriad Pro", fontSize: "16px"}}>Add friend</div>
				</Button>
				<Button sx={{borderRadius: 2}} variant="contained" startIcon={<DeleteIcon />}>
					<div style={{margin: "5px", padding: "3px", fontFamily: "Myriad Pro", fontSize: "16px"}}>Delete friend</div>
				</Button>
			</Stack>
			<Stack direction="column" sx={{width: 0.85, height: 9/12}}>
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
														sx={{width: "64px", height: "64px"}}>
														src={`http:///localhost/api/users/${match.loginAdversaireOne}/avatar`}
													</Avatar>
													<div style={{fontSize: "24px", fontFamily: "Myriad Pro"}}>{match.loginAdversaireOne}</div>
												</Stack>
												<Stack direction="row" sx={{width: 1/2}} justifyContent="flex-end">
													{match.scoreOne > match.scoreTwo ?
														<div style={{fontSize: "32px", color: "green", fontStyle: "bold", fontFamily: "Myriad Pro" }}>{match.scoreOne}</div> :
													match.scoreOne === match.scoreTwo ?
														<div style={{fontSize: "32px", color: "black", fontStyle: "bold", fontFamily: "Myriad Pro" }}>{match.scoreOne}</div> :
														<div style={{fontSize: "32px", color: "#C70039", fontStyle: "bold", fontFamily: "Myriad Pro" }}>{match.scoreOne}</div>
													}
												</Stack>
											</Stack>
											<Stack direction="row" sx={{width: 0.1/12, padding: '10px'}} alignItems="center" justifyContent="center">
												<h1>-</h1>
											</Stack>
											<Stack direction="row" sx={{width: 5.95/12, padding: '20px'}} alignItems="center">
												<Stack direction="row" sx={{width: 1/2}} justifyContent="flex-start">
													{match.scoreOne > match.scoreTwo ?
														<div style={{fontSize: "32px", color: "#C70039", fontStyle: "bold", fontFamily: "Myriad Pro" }}>{match.scoreTwo}</div> :
													match.scoreOne === match.scoreTwo ?
														<div style={{fontSize: "32px", color: "black", fontStyle: "bold", fontFamily: "Myriad Pro" }}>{match.scoreTwo}</div> :
														<div style={{fontSize: "32px", color: "green", fontStyle: "bold", fontFamily: "Myriad Pro" }}>{match.scoreTwo}</div>
													}
												</Stack>
												<Stack direction="row" sx={{width: 1/2}} alignItems="center" justifyContent="flex-end" spacing={2}>
													<div style={{fontSize: "24px", fontFamily: "Myriad Pro"}}>{match.loginAdversaireTwo}</div>
													<Avatar
														sx={{width: "64px", height: "64px"}}>
														src={`http:///localhost/api/users/${match.loginAdversaireTwo}/avatar`}
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