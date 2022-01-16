import { Avatar, Divider, List, ListItem, Paper, Stack } from "@mui/material";
import { avatarStyle } from "../styles/Styles";
import { useEffect, useState } from 'react';
import { api, apiAchievements, apiUsers } from "../services/Api/Api";
import { Achievements, User } from "../services/Interface/Interface";
import axios from "axios";
import MyChargingDataAlert from "./MyChargingDataAlert";
import MyError from "./MyError";
import MySnackBar from "./MySnackbar";

const MyAchievements = (props: {user: User}) => {
	const { user } = props;
	const [achievements, setAchievements] = useState<Achievements[]>([]);
	const [error, setError] = useState<unknown>("");

	useEffect(() => {
		const fetchAchievements = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}/${user.login}${apiAchievements}`);
				setAchievements(response.data);
			}
			catch (err) {
				setError(err);
			}
		}
		fetchAchievements();
	}, [user.login]);

	// eslint-disable-next-line eqeqeq
	if (achievements == undefined && error === "")
		return (<MyChargingDataAlert />);
	// eslint-disable-next-line eqeqeq
	else if (error !== "" || achievements == undefined)
		return (<MyError error={error}/>);
	return (
		<Stack sx={{ marginTop: "15%", width: 0.90, height: 0.4, backgroundColor: 'white', borderRadius: 7 }} direction="column">
			<Stack direction="row" alignItems="center" justifyContent="space-between">
				<h2 style={{ marginLeft: '11px', fontFamily: "Myriad Pro", color:'black' }}>Achievements</h2>
				<h2 style={{ marginRight: '11px', fontFamily: "Myriad Pro", color:'black' }}>{achievements.length} / 12</h2>
			</Stack>
			<Divider />
			<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto'}} elevation={0}>
				{ achievements.length > 0 ?
					<List>
						{achievements.map(achievement => (
							<div key={achievement.achievement_id}>
								<ListItem component="div" disablePadding sx={{marginBottom: "10px", marginTop: "10px"}}>
									<Stack direction="row">
										<Stack sx={{ width: "100%", height: 1}} alignItems="center" direction="row">
											<Stack sx={{ width: "100%", height: 1}}
												alignItems="center"
												spacing={2}
												direction="row">
												<Avatar
													src={achievement.achievement_avatar}
													sx={avatarStyle}>
												</Avatar>
												<h3>{achievement.achievement_description}</h3>
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
			<MySnackBar message="Données achievements chargées" severity="success" time={4000}/>
		</Stack>
	);
}

export default MyAchievements;
