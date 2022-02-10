import { Avatar, Box, Divider, List, ListItem, Paper, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { api, apiAchievements, apiMe } from "../../Services/Api/Api";
import { Achievements } from "../../Services/Interface/Interface";

function GameAchievementsRecent() {
	const [achievements, setAchievements] = useState<Achievements[]>([]);
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const fetchAchievementRecent = async () => {
			try {
				const response = await axios.get(`${api}${apiMe}${apiAchievements}/recents`)
				setAchievements(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de charger les nouveaux achievements (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchAchievementRecent();
	}, [enqueueSnackbar])

	return (
		<React.Fragment>
			{achievements.length > 0 ?
				<Stack sx={{
					width: "auto",
					backgroundColor: 'white',
					borderRadius: {xs: 1, sm: 2, md: 3, lg: 4},
				}}
					direction="column"
				>
					<Box sx={{backgroundColor: "orange", borderTopLeftRadius: 3, borderTopRightRadius: 3}}>
						<Typography
							variant="h6"
							style={{color:'black', margin: "1%"}}
						>
							New achievements :
						</Typography>
					</Box>
					<Divider />
					<Paper
						style={{minHeight: 1, minWidth: 0.9, overflow: 'auto'}}
						elevation={3}
					>
						<List>
							{achievements.map(achievement => (
								<div key={achievement.achievement_id}>
									<ListItem
										component="div"
										disablePadding
										sx={{marginBottom: "10px", marginTop: "10px"}}
									>
										<Stack
											sx={{ width: "100%", height: 1}}
											alignItems="center"
											direction="row"
										>
											<Stack sx={{ width: "100%", height: 1}}
												alignItems="center"
												spacing={2}
												direction="row">
												<Avatar
													src={achievement.achievement_avatar}
													sx={{
														width: "32px",
														height: "32px"
													}}>
												</Avatar>
												<Typography variant="subtitle1" style={{textAlign: "center"}}>{achievement.achievement_description}</Typography>
											</Stack>
										</Stack>
									</ListItem>
									<Divider />
								</div>
							))}
						</List>
					</Paper>
				</Stack> : null
			}
		</React.Fragment>
	);
}

export default GameAchievementsRecent;