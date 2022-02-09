import { Button, Dialog, DialogActions, DialogContent, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import MyAppBarClose from "../../../components/MyAppBarClose";
import { api, apiGame, apiMatchmaking, apiRooms } from "../../../Services/Api/Api";
import { MATCHTYPE, RoomV } from "../Services/utils";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreateRoom from "./CreateRoom";
import DeleteIcon from '@mui/icons-material/Delete';
import useMe from "../../../Services/Hooks/useMe";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import { matchJoinNormal, matchLeave } from "../Services/wsGame";
import { useNavigate } from "react-router-dom";
import { socketMatchmaking } from "../../../Services/ws/utils";
import { useSnackbar } from "notistack";
import { PAGE } from "../../../Services/Interface/Interface";

function RoomsView() {
	const [rooms, setRooms] = useState<RoomV[]>([]);
	const [openCreateRoom, setOpenCreateRoom] = useState<boolean>(false);
	const me = useMe();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const handleClose = () => {
		navigate(`${apiGame}`);
	}

	useEffect(() => {
		const interval = setInterval(async () => {
			try {
				const response = await axios.get(`${api}${apiMatchmaking}${apiRooms}`)
				setRooms(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Error : ${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}, 2000)
		return () => clearInterval(interval);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		socketMatchmaking.on("matchmaking::onMatch", (data) => {
			navigate(`${apiGame}/${data.match.hash}`);
		})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleJoinRoom = (room: RoomV) => {
		if (room.room.type === MATCHTYPE.MATCH_DUEL)
			matchJoinNormal(MATCHTYPE.MATCH_DUEL, room.room.name);
		else
			matchJoinNormal(MATCHTYPE.MATCH_NORMAL, room.room.name);
	}

	const handleDeleteRoom = () => {
		matchLeave();
	}

	if (me === undefined) {
		return (
			<MyChargingDataAlert />
		);
	}

	const disabledButton = () => {
		if (rooms.length > 0 && rooms.find(room => room.owner.id === me.id) !== undefined)
			return (true);
		return (false);
	}

	return (
		<Dialog
			open={true}
			fullScreen
			onClose={handleClose}
			PaperProps={{
				style: {
				  backgroundColor: '#1d3033',
				  color:'white'
				},
			}}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
            <MyAppBarClose setOpen={handleClose} name={PAGE.MENU_PARTIE}/>
			<DialogContent>
				<Stack sx={{backgroundColor: 'white', height: 1, width: 1, borderRadius: 5}}>
					<TableContainer sx={{borderRadius: 5}}>
						<Table>
							<TableHead sx={{backgroundColor: "orange"}}>
								<TableRow>
									<TableCell align="center">
										<Typography style={{fontFamily: "Myriad Pro"}}>Name</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography style={{fontFamily: "Myriad Pro"}}>Login</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography style={{fontFamily: "Myriad Pro"}}>Type</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography style={{fontFamily: "Myriad Pro"}}>Action</Typography>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{rooms.map((room) => (
									<TableRow key={room.owner.id}>
										<TableCell align="center">
											<Typography>{room.room.name}</Typography>
										</TableCell>
										<TableCell align="center">
											<Typography>{room.owner.login}</Typography>
										</TableCell>
										<TableCell align="center">
											<Typography>{room.room.type}</Typography>
										</TableCell>
										<TableCell align="center">
											{room.owner.id !== me.id ?
												<IconButton
													disabled={disabledButton()}
													onClick={() => handleJoinRoom(room)}
												>
													<ArrowForwardIcon />
												</IconButton> :
												<IconButton
													onClick={() => handleDeleteRoom()}
													color="error"
												>
													<DeleteIcon />
												</IconButton>
											}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Stack
					direction="row"
					sx={{width: 1, marginBottom: "15px"}}
					justifyContent="space-around"
					alignItems="center"
					spacing={2}
				>
					<Button
						variant="contained"
						color="success"
						disabled={disabledButton()}
						onClick={() => setOpenCreateRoom(true)}
					>
						<Typography
							variant="h6"
							style={{fontFamily: "Myriad Pro", color: disabledButton() ? "grey" : "white"}}
						>
							Create new room
						</Typography>
					</Button>
					<Button
						variant="contained"
						color="success"
						disabled={disabledButton()}
						onClick={() => navigate(`${apiGame}${apiMatchmaking}`)}
					>
						<Typography
							variant="h6"
							style={{fontFamily: "Myriad Pro", color: disabledButton() ? "grey" : "white"}}
						>
							Rechercher une partie classée
						</Typography>
					</Button>
				</Stack>
			</DialogActions>
			{openCreateRoom ? <CreateRoom me={me} setOpen={setOpenCreateRoom} /> : null}
		</Dialog>
	);
}

export default RoomsView;