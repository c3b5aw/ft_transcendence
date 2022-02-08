import { Avatar, Box, Dialog, DialogContent, Divider, List, ListItem, Paper, Stack, Typography } from "@mui/material";
import { avatarStyle } from "../../../styles/Styles";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import useAchievements from "../Services/useAchievements";
import { User } from "../../../Services/Interface/Interface";
import { Dispatch, SetStateAction } from "react";
import MyAppBarClose from "../../../components/MyAppBarClose";

const MyAchievements = (props: {user: User, setOpen: Dispatch<SetStateAction<boolean>>}) => {
	const { user, setOpen } = props;
	const achievements = useAchievements(user);

	const handleClose = () => {
		setOpen(false)
	}

	if (achievements === undefined)
		return (<MyChargingDataAlert />);
	return (
		<Dialog
			open={true}
			onClose={handleClose}
			fullScreen
			PaperProps={{
				style: {
				  backgroundColor: '#1d3033',
				  color:'white'
				},
			}}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<MyAppBarClose setOpen={setOpen}/>
			<DialogContent sx={{alignItems: "center"}}>
				<Stack sx={{
					width: "auto",
					backgroundColor: 'white',
					borderRadius: {xs: 1, sm: 2, md: 3, lg: 4},
				}}
					direction="column"
				>
					<Box sx={{backgroundColor: "orange", borderTopLeftRadius: 3, borderTopRightRadius: 3}}>
						<Typography
							variant="h5"
							style={{fontFamily: "Myriad Pro", color:'black', margin: "1%"}}
						>
							Achievements
						</Typography>
					</Box>
					<Divider />
					<Paper
						style={{minHeight: 1, minWidth: 0.9, overflow: 'auto'}}
						elevation={0}
					>
						{ achievements.length > 0 ?
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
														sx={avatarStyle}>
													</Avatar>
													<Typography variant="h5" style={{fontFamily: "Myriad Pro", textAlign: "center"}}>{achievement.achievement_description}</Typography>
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
			</DialogContent>
		</Dialog>
	);
}

export default MyAchievements;
