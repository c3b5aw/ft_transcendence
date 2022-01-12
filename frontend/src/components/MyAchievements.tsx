import { Avatar, CircularProgress, Divider, List, ListItem, Paper, Stack } from "@mui/material";
import { avatarStyle } from "../styles/Styles";
import { useState } from "react";
import { apiAchievements } from "../services/Api/Api";
import axios from "axios";
import { Achievements } from "../services/Interface/Interface";

const MyAchievements = () => {
	const [achievements, setAchievements] = useState<Achievements[]>([]);

	useEffects(() => {
		const fetchAchievements = async () => {
			try {
				const response = await axios.get(`${apiAchievements}`);
				setAchievements(response.data);
			}
			catch (err) {
				console.log(err);
			}
		}
		fetchAchievements();
	}, []);

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
							<div key={achievement.id}>
								<ListItem component="div" disablePadding>
									<Stack direction="row">
										<Stack sx={{ width: 1, height: 1}} alignItems="center" direction="row">
											<Stack sx={{ width: "85%", height: 1}}
												alignItems="center"
												spacing={2}
												direction="row">
												<Avatar sx={avatarStyle} src=""></Avatar>
												<h2>{achievement.description}</h2>
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
	);
}

export default MyAchievements;

function useEffects(arg0: () => void, arg1: never[]) {
	throw new Error("Function not implemented.");
}
