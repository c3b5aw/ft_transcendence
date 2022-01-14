import { Avatar, CircularProgress, Divider, List, ListItem, Paper, Stack } from "@mui/material";
import { avatarStyle } from "../styles/Styles";
import { useEffect, useState } from 'react';
import { api, apiAchievements, apiUsers } from "../services/Api/Api";
import axios from "axios";
import { Achievements, User } from "../services/Interface/Interface";

const MyAchievements = (props: {user: User}) => {
	const { user } = props;
	const [achievements, setAchievements] = useState<Achievements[]>([]);

	useEffect(() => {
		const fetchAchievements = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}/${user.login}${apiAchievements}`);
				setAchievements(response.data);
			}
			catch (err) {
				console.log(err);
			}
		}
		fetchAchievements();
	}, [user.login]);

	// eslint-disable-next-line eqeqeq
	if (achievements == undefined) {
		return (
			<Stack sx={{ marginTop: "15%", width: 0.90, height: 0.4}} direction="column" alignItems="center" justifyContent="center">
				<CircularProgress sx={{color: "white"}} />
			</Stack>
		);
	}
	return (
		<Stack sx={{ marginTop: "15%", width: 0.90, height: 0.4, backgroundColor: 'white', borderRadius: 7 }} direction="column">
			<Stack direction="row" alignItems="center" justifyContent="space-between">
				<h2 style={{ marginLeft: '11px', fontFamily: "Myriad Pro", color:'black' }}>Achievements</h2>
				<h2 style={{ marginRight: '11px', fontFamily: "Myriad Pro", color:'black' }}>{achievements.length} / 12</h2>
			</Stack>
			<Divider />
			<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto'}}>
				{ achievements.length > 0 ?
					<List>
						{achievements.map(achievement => (
							<div key={achievement.achievement_id}>
								<ListItem component="div" disablePadding sx={{marginBottom: "10px", marginTop: "10px"}}>
									<Stack direction="row">
										<Stack sx={{ width: 1, height: 1}} alignItems="center" direction="row">
											<Stack sx={{ width: "85%", height: 1}}
												alignItems="center"
												spacing={2}
												direction="row">
												<Avatar
													// src={achievement.avatar}
													sx={avatarStyle}></Avatar>
												{/* <h3>{achievement.description}</h3> */}
												<h3>Description</h3>
											</Stack>
										</Stack>
									</Stack>
								</ListItem>
								<Divider />
							</div>
						))}
					</List> : null
				}
			</Paper>
		</Stack>
	);
}

export default MyAchievements;
