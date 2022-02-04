import { Avatar, Box, CircularProgress, Divider, List, ListItem, Paper, Stack, Typography } from "@mui/material"
import { User } from "../../../Services/Interface/Interface";
import useMatchs from "../Services/useMatchs";

const MyHistory = (props: {user: User}) => {
	const { user } = props;
	const matchs = useMatchs(user);

	if (matchs === undefined)
		return (
			<Stack alignItems="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>);
	return (
		<Stack
			sx={{width: 1, height: 1}}
			direction="column"
			alignItems="center"
			justifyContent="center"
		>
			<Stack
				direction="column"
				sx={{width: 1, height: 9/12}}
			>
			{ matchs.length > 0 ?
				<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto', borderRadius: 40}}>
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
													<Avatar
														sx={{width: {xs: "40px", sm: "56px", md: "64px", lg: "64px"}, height: {xs: "40px", sm: "56px", md: "64px", lg: "64px"}}}
														src={`/api/users/${match.player1_login}/avatar`}>
													</Avatar>
													<Box sx={{display: {xs: "none", sm: "flex", md: "flex"}}}>
														<Typography variant="h6" style={{fontFamily: "Myriad Pro", textAlign: "center"}}>{match.player1_login}</Typography>
													</Box>
												</Stack>
												<Stack
													direction="row"
													sx={{width: 1/2}}
													justifyContent="flex-end"
												>
													<Typography variant="h4" style={{
														fontFamily: "Myriad Pro",
														textAlign: "center",
														color: match.player1_score > match.player2_score ? "green" : match.player1_score < match.player2_score ? "#C70039" : "black",
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
												<Typography variant="h4" style={{fontFamily: "Myriad Pro", textAlign: "center"}}>-</Typography>
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
														color: match.player2_score > match.player1_score ? "green" : match.player2_score < match.player1_score ? "#C70039" : "black",
													}}>
														{match.player2_score}
													</Typography>
												</Stack>
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
													<Avatar
														sx={{width: {xs: "40px", sm: "56px", md: "64px", lg: "64px"}, height: {xs: "40px", sm: "56px", md: "64px", lg: "64px"}}}
														src={`/api/users/${match.player2_login}/avatar`}>
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