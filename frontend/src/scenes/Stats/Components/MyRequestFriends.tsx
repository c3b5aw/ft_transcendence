import { Avatar, Box, Button, Dialog, DialogContent, Divider, List, ListItem, Paper, Stack, Typography } from "@mui/material";
import { Friend } from "../../../Services/Interface/Interface";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MyAppBarClose from "../../../components/MyAppBarClose";
import axios from "axios";
import { useSnackbar } from "notistack";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import { api, apiUsers } from "../../../Services/Api/Api";

const MyRequestFriends = (props: {setOpen: Dispatch<SetStateAction<boolean>>}) => {
	const { setOpen } = props;
	const [friendsPending, setFriendsPending] = useState<Friend[]>([]);
	const { enqueueSnackbar } = useSnackbar();
	const [reload, setReload] = useState<boolean>(false);

	const handleClose = () => {
		setOpen(false);
	}

	const handleAcceptFriend = async (friendPending: Friend) => {
		try {
			await axios.get(`${api}${apiUsers}/${friendPending.login}/friend`);
			setReload(!reload);
		}
		catch (err) {
			enqueueSnackbar(`${err}`, { 
				variant: 'error',
				autoHideDuration: 3000,
			});
		}
	}

	const handleRefuseFriend = async (friendPending: Friend) => {
		try {
			await axios.delete(`${api}${apiUsers}/${friendPending.login}/friend`);
			setReload(!reload);
		}
		catch (err) {
			enqueueSnackbar(`${err}`, { 
				variant: 'error',
				autoHideDuration: 3000,
			});
		}
	}

	useEffect(() => {
		const fetchFriendsMePending = async () => {
			try {
				const url = `/api/profile/friends/pending`;
				const reponse = await axios.get(url);
				setFriendsPending(reponse.data);
			} catch (err) {
				enqueueSnackbar(`${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchFriendsMePending();
	}, [enqueueSnackbar, reload])

	if (friendsPending === undefined) {
		return (
			<MyChargingDataAlert />
		);
	}
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
							Demandes d'amis
						</Typography>
					</Box>
					<Divider />
					<Paper
						style={{minHeight: 1, minWidth: 0.9, overflow: 'auto'}}
						elevation={0}
					>
						{ friendsPending.length > 0 ?
							<List>
								{friendsPending.map(friendPending => (
									<div key={friendPending.id}>
										<ListItem
											component="div"
											disablePadding
											sx={{marginBottom: "10px", marginTop: "10px"}}
										>
											<Stack
												sx={{ width: 0.975, height: 1}}
												alignItems="center"
												direction="row"
												justifyContent="space-between"
											>
												<Stack sx={{ width: "100%", height: 1}}
													alignItems="center"
													spacing={2}
													direction="row">
													<Avatar
														sx={{margin: 1, width: {xs: "40px", sm: "56px", md: "64px", lg: "64px"}, height: {xs: "40px", sm: "56px", md: "64px", lg: "64px"}}}
														src={`/api/users/${friendPending.login}/avatar`}>
													</Avatar>
													<Typography variant="h5" style={{fontFamily: "Myriad Pro", textAlign: "center"}}>{friendPending.login}</Typography>
												</Stack>
												<Stack
													direction="row"
													spacing={2}
												>
													<Button
														variant="contained"
														color="success"
														onClick={() => handleAcceptFriend(friendPending)}
													>
														Accepter
													</Button>
													<Button
														variant="contained"
														color="error"
														onClick={() => handleRefuseFriend(friendPending)}
													>
														Refuser
													</Button>
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

export default MyRequestFriends;
