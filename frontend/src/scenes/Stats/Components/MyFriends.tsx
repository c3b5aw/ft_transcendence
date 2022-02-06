import { Avatar, Box, Dialog, DialogContent, Divider, List, ListItem, Paper, Stack, Typography } from "@mui/material";
import { avatarStyle } from "../../../styles/Styles";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import { User } from "../../../Services/Interface/Interface";
import { Dispatch, SetStateAction } from "react";
import MyAppBarClose from "../../../components/MyAppBarClose";
import useFriends from "../Services/useFriends";

const MyFriends = (props: {user: User, setOpen: Dispatch<SetStateAction<boolean>>}) => {
	const { user, setOpen } = props;
	const friends = useFriends(user);

	const handleClose = () => {
		setOpen(false)
	}

	if (friends === undefined)
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
				{friends.length > 0 ?
					<Stack sx={{
						width: "auto",
						backgroundColor: 'white',
						borderRadius: {xs: 1, sm: 2, md: 3, lg: 4},
					}}
						direction="column"
					>
						<Box sx={{backgroundColor: "green", borderTopLeftRadius: 3, borderTopRightRadius: 3}}>
							<Typography
								variant="h5"
								style={{fontFamily: "Myriad Pro", color:'white', margin: "1%"}}
							>
								Amis
							</Typography>
						</Box>
						<Divider />
						<Paper
							style={{minHeight: 1, minWidth: 0.9, overflow: 'auto'}}
							elevation={0}
						>
							<List>
								{friends.map(friend => (
									<div key={friend.id}>
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
													direction="row"
												>
													<Avatar
														src={`/api/users/${friend.login}/avatar`}
														sx={avatarStyle}>
													</Avatar>
													<Typography variant="h5" style={{fontFamily: "Myriad Pro", textAlign: "center"}}>{friend.login}</Typography>
												</Stack>
											</Stack>
										</ListItem>
										<Divider />
									</div>
								))}
							</List>
						</Paper>
					</Stack> : <Typography variant="h3" style={{fontFamily: "Myriad Pro", color: "grey", textAlign: "center"}}>Aucun ami</Typography>
				}
			</DialogContent>
		</Dialog>
	);
}

export default MyFriends;
