import { Button, Dialog, DialogContent, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MyAppBarClose from "../../../components/MyAppBarClose";
import { api, apiMatchmaking, apiRooms } from "../../../Services/Api/Api";
import { RoomV } from "../Services/utils";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function RoomsView(props: {setOpen: Dispatch<SetStateAction<boolean>>}) {
	const { setOpen } = props;
	const [rooms, setRooms] = useState<RoomV[]>([]);

	const handleClose = () => {
		setOpen(false);
	}

	useEffect(() => {
		const fetchRooms = async () => {
			try {
				const response = await axios.get(`${api}${apiMatchmaking}${apiRooms}`)
				setRooms(response.data);
			}
			catch (err) {
				console.log(err);
			}
		}
		// const interval = setInterval(() =>{
		// 	fetchRooms();
		// }, 1000)
		fetchRooms();
		// return () => clearInterval(interval);
	}, [])

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
            <MyAppBarClose setOpen={handleClose} />
			<DialogContent>
				<Stack
					direction="row"
					sx={{width: 1, marginBottom: "15px"}}
					justifyContent="space-between"
					alignItems="center"
				>
					<Typography variant="h4" style={{fontFamily: "Myriad Pro", color: "white"}}>Rooms</Typography>
					<Button variant="contained" onClick={() => console.log("CREATE NEW ROOM")}>
						<Typography variant="h6" style={{fontFamily: "Myriad Pro", color: "white"}}>Create new room</Typography>
					</Button>
				</Stack>
				<Stack sx={{backgroundColor: 'white', height: 0.9, width: 1, borderRadius: 5}}>
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
										<Typography style={{fontFamily: "Myriad Pro"}}>Join</Typography>
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
											<IconButton onClick={() => console.log("JOIN ROOM")}>
												<ArrowForwardIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Stack>
			</DialogContent>
		</Dialog>
	);
}

export default RoomsView;