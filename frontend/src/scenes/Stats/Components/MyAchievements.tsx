import { Avatar, Divider, List, ListItem, Paper, Stack, Typography } from "@mui/material";
import { avatarStyle } from "../../../styles/Styles";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import useAchievements from "../Services/useAchievements";
import { User } from "../../../Services/Interface/Interface";

const MyAchievements = (props: {user: User}) => {
	const { user } = props;
	const achievements = useAchievements(user);

	if (achievements === undefined)
		return (<MyChargingDataAlert />);
	return (
		<Stack sx={{ width: "auto", height: 0.4, backgroundColor: 'white', borderRadius: {xs: 1, sm: 2, md: 3, lg: 4}}} direction="column">
			<Typography variant="h5" style={{fontFamily: "Myriad Pro", color:'black', margin: "5%"}}>Achievements</Typography>
			<Divider />
			<Paper style={{minHeight: 1, minWidth: 1, overflow: 'auto'}} elevation={0}>
				{ achievements.length > 0 ?
					<List>
						{achievements.map(achievement => (
							<div key={achievement.achievement_id}>
								<ListItem component="div" disablePadding sx={{marginBottom: "10px", marginTop: "10px"}}>
									<Stack sx={{ width: "100%", height: 1}} alignItems="center" direction="row">
										<Stack sx={{ width: "100%", height: 1}}
											alignItems="center"
											spacing={2}
											direction="row">
											<Avatar
												src={achievement.achievement_avatar}
												sx={avatarStyle}>
											</Avatar>
											<Typography variant="h5">{achievement.achievement_description}</Typography>
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
