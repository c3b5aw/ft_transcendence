import { Avatar, Box, Divider, List, ListItem, Paper, Stack, Tooltip, Typography } from "@mui/material"
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { api, apiMatch, apiUsers } from "../../../Services/Api/Api";
import { Match, User } from "../../../Services/Interface/Interface";
import { avatarStyle } from "../../../styles/Styles";

const MyHistory = (props: {user: User}) => {
	const { user } = props;
	const [matchs, setMatchs] = useState<Match[]>([]);
	const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
		const fetchMatchs = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}/${user.login}${apiMatch}`);
				setMatchs(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de charger les matchs de ${user.login} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchMatchs();
	}, [enqueueSnackbar, user.login]);

	return (
		<Stack
			direction="column"
			sx={{width: 1, height: 1}}
			alignItems="center"
		>
			<Stack
				direction="column"
				sx={{width: 1, height: 1}}
			>
				{matchs.length > 0 ?
					<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', backgroundColor: "#ffffff"}} elevation={0}>
						<List>
						{matchs.map(match => (
							<div key={match.id}>
								<ListItem component="div">
									<Stack
										sx={{ width:1, height: 1}}
										direction="row"
									>
										<Stack
											direction="row"
											sx={{width: 5.95/12, padding: '20px'}}
											spacing={2}
											justifyContent="center"
											alignItems="center"
										>
											<Stack
												direction="row"
												sx={{width: 1/2}}
												alignItems="center"
												spacing={2}
											>
												<Tooltip title={match.player1_login}>
													<Avatar
														sx={{width: {xs: "40px", sm: "56px", md: "64px", lg: "64px"}, height: {xs: "40px", sm: "56px", md: "64px", lg: "64px"}}}
														src={`/api/users/${match.player1_login}/avatar`}>
													</Avatar>
												</Tooltip>
												<Box sx={{display: {xs: "none", sm: "flex", md: "flex"}}}>
													<Typography variant="h6" style={{fontFamily: "Myriad Pro", textAlign: "center", color: "black"}}>{match.player1_login}</Typography>
												</Box>
											</Stack>
											{match.winner === match.player1 ?
												<Avatar
													src={`/api/achievements/1/avatar`}
													sx={avatarStyle}>
												</Avatar> : null
											}
											<Stack
												direction="row"
												sx={{width: 1/2}}
												justifyContent="flex-end"
											>
												<Typography variant="h4" style={{
													fontFamily: "Myriad Pro",
													textAlign: "center",
													color: match.winner === match.player1 ? "green" : match.winner === -1 ? "black" : "#C70039"
												}}>
													{match.player1_score}
												</Typography>
											</Stack>
										</Stack>
										<Stack
											direction="row"
											sx={{width: 0.1/12, padding: '5px'}}
											alignItems="center"
											justifyContent="center"
										>
											<Typography variant="h4" style={{fontFamily: "Myriad Pro", textAlign: "center", color: "black"}}>-</Typography>
										</Stack>
										<Stack
											direction="row"
											sx={{width: 5.95/12, padding: '20px'}}
											alignItems="center"
											spacing={2}
										>
											<Stack
												direction="row"
												sx={{width: 1/2}}
												justifyContent="flex-start"
											>
												<Typography variant="h4" style={{
													fontFamily: "Myriad Pro",
													textAlign: "center",
													color: match.winner === match.player2 ? "green" : match.winner === -1 ? "black" : "#C70039"
												}}>
													{match.player2_score}
												</Typography>
											</Stack>
											{match.winner === match.player2 ?
												<Avatar
													src={`/api/achievements/1/avatar`}
													sx={avatarStyle}>
												</Avatar> : null
											}
											<Stack
												direction="row"
												sx={{width: 1/2}}
												alignItems="center"
												justifyContent="flex-end"
												spacing={2}
											>
												<Box sx={{display: {xs: "none", sm: "flex", md: "flex"}}}>
													<Typography variant="h6" style={{fontFamily: "Myriad Pro", textAlign: "center"}}>{match.player2_login}</Typography>
												</Box>
												<Tooltip title={match.player2_login}>
													<Avatar
														sx={{width: {xs: "40px", sm: "56px", md: "64px", lg: "64px"}, height: {xs: "40px", sm: "56px", md: "64px", lg: "64px"}}}
														src={`/api/users/${match.player2_login}/avatar`}>
													</Avatar>
												</Tooltip>
											</Stack>
										</Stack>
									</Stack>
								</ListItem>
								<Divider />
							</div>
						))}
						</List>
					</Paper> : 
					<Typography
						variant="h3"
						style={{fontFamily: "Myriad Pro", color: "grey", textAlign: "center"}}
					>
						Aucun match
					</Typography>
				}
			</Stack>
		</Stack>
	);
}

export default MyHistory;