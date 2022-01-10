import { Avatar, Button, CircularProgress, Divider, List, ListItem, Paper, Stack } from "@mui/material"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { MatchsPropsTest, MatchsProps, MatchProps } from "../utils/Interface";
import { api, apiUsers } from "../utils/Api";

const MyHistory = (matchs: MatchsPropsTest[]) => {
	// eslint-disable-next-line eqeqeq
	if (matchs == undefined) {
		return (
			<Stack sx={{width: 1, height: "100vh"}} direction="column" alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}

	const testMatchHistory: MatchProps[] = [
		{
			id: 1,
			login_adversaire_one: "eoliveir",
			login_adversaire_two: "sbeaujar",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 65,
			score_two: 44
		},
		{
			id: 2,
			login_adversaire_one: "eoliveir",
			login_adversaire_two: "nbascaul",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 56,
			score_two: 48
		},
		{
			id: 3,
			login_adversaire_one: "nbascaul",
			login_adversaire_two: "sbeaujar",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 32,
			score_two: 48
		},
		{
			id: 4,
			login_adversaire_one: "nbascaul",
			login_adversaire_two: "sbeaujar",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 32,
			score_two: 48
		},
		{
			id: 5,
			login_adversaire_one: "nbascaul",
			login_adversaire_two: "sbeaujar",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 32,
			score_two: 48
		},
		{
			id: 6,
			login_adversaire_one: "nbascaul",
			login_adversaire_two: "sbeaujar",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 32,
			score_two: 48
		},
		{
			id: 7,
			login_adversaire_one: "nbascaul",
			login_adversaire_two: "sbeaujar",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 32,
			score_two: 48
		},
		{
			id: 8,
			login_adversaire_one: "nbascaul",
			login_adversaire_two: "sbeaujar",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 32,
			score_two: 48
		},
		{
			id: 9,
			login_adversaire_one: "nbascaul",
			login_adversaire_two: "sbeaujar",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 32,
			score_two: 48
		},
		{
			id: 10,
			login_adversaire_one: "nbascaul",
			login_adversaire_two: "sbeaujar",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 32,
			score_two: 48
		},
		{
			id: 11,
			login_adversaire_one: "nbascaul",
			login_adversaire_two: "sbeaujar",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 32,
			score_two: 32
		},
		{
			id: 12,
			login_adversaire_one: "nbascaul",
			login_adversaire_two: "sbeaujar",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 32,
			score_two: 48
		},
		{
			id: 13,
			login_adversaire_one: "nbascaul",
			login_adversaire_two: "sbeaujar",
			avatar_url_one: "",
			avatar_url_two: "",
			score_one: 32,
			score_two: 48
		}
	];

	const testMessageList: MatchsProps =
	{
		id: 1,
		played: 12,
		victories: 8,
		defeats: 4,
		history: testMatchHistory
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
			{ testMessageList.history.length > 0 ?
				<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', borderRadius: 40}}>
						<List>
							{testMessageList.history.map(match => (
								<div key={match.id}>
									<ListItem component="div">
										<Stack sx={{ width:1, height: 1}} direction="row">
											<Stack direction="row" sx={{width: 5.95/12, padding: '20px'}} spacing={2} justifyContent="center" alignItems="center">
												<Stack direction="row" sx={{width: 1/2}} alignItems="center" spacing={2}>
													<Avatar sx={{width: "64px", height: "64px"}}></Avatar>
													<div style={{fontSize: "24px", fontFamily: "Myriad Pro"}}>{match.login_adversaire_one}</div>
												</Stack>
												<Stack direction="row" sx={{width: 1/2}} justifyContent="flex-end">
													{match.score_one > match.score_two ?
														<div style={{fontSize: "32px", color: "green", fontStyle: "bold", fontFamily: "Myriad Pro" }}>{match.score_one}</div> :
													match.score_one === match.score_two ?
														<div style={{fontSize: "32px", color: "black", fontStyle: "bold", fontFamily: "Myriad Pro" }}>{match.score_one}</div> :
														<div style={{fontSize: "32px", color: "#C70039", fontStyle: "bold", fontFamily: "Myriad Pro" }}>{match.score_one}</div>
													}
												</Stack>
											</Stack>
											<Stack direction="row" sx={{width: 0.1/12, padding: '10px'}} alignItems="center" justifyContent="center">
												<h1>-</h1>
											</Stack>
											<Stack direction="row" sx={{width: 5.95/12, padding: '20px'}} alignItems="center">
												<Stack direction="row" sx={{width: 1/2}} justifyContent="flex-start">
													{match.score_one > match.score_two ?
														<div style={{fontSize: "32px", color: "#C70039", fontStyle: "bold", fontFamily: "Myriad Pro" }}>{match.score_two}</div> :
													match.score_one === match.score_two ?
														<div style={{fontSize: "32px", color: "black", fontStyle: "bold", fontFamily: "Myriad Pro" }}>{match.score_two}</div> :
														<div style={{fontSize: "32px", color: "green", fontStyle: "bold", fontFamily: "Myriad Pro" }}>{match.score_two}</div>
													}
												</Stack>
												<Stack direction="row" sx={{width: 1/2}} alignItems="center" justifyContent="flex-end" spacing={2}>
													<div style={{fontSize: "24px", fontFamily: "Myriad Pro"}}>{match.login_adversaire_two}</div>
													<Avatar sx={{width: "64px", height: "64px"}}></Avatar>
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