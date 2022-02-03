import { Dialog, DialogContent, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MyAppBarClose from "../../../components/MyAppBarClose";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import axios from "axios";
import { api, apiGame, apiMatch } from "../../../Services/Api/Api";
import { Match } from "../../../Services/Interface/Interface";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

function MatchProgress(props: {setOpen: Dispatch<SetStateAction<boolean>>}) {
	const { setOpen } = props;
	const [matchsProgress, setMatchsProgress] = useState<Match[]>([])
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const handleClose = () => {
		setOpen(false);
	}

	useEffect(() => {
		const fetchMatchProgress = async () => {
			try {
				const response = await axios.get(`${api}${apiMatch}/in-progress`);
				setMatchsProgress(response.data);
			}
			catch (err: any) {
				enqueueSnackbar(`Error : ${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		const interval = setInterval(() => {
			fetchMatchProgress();
		}, 1000)
		fetchMatchProgress();
		return () => clearInterval(interval);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function HandleTimeMatch(props: {match: Match}) {
		const { match } = props;
		const now = new Date();
		const time_match = new Date(match.date);
		const diff = now.getTime() - time_match.getTime();
		
		const days = Math.floor(diff / (1000 * 3600 * 24));
		const rest_day = diff % (1000 * 3600 * 24);

		const hours = Math.floor(rest_day / (1000 * 3600));
		const rest_hours = diff % (1000 * 3600);

		const minutes = Math.floor(rest_hours / (1000 * 60));
		const rest_minutes = diff % (1000 * 60);

		const seconds = Math.floor(rest_minutes / (1000));

		var res;
		if (hours > 0) {
			res = `${days}j ${hours}h ${minutes}min ${seconds}sec`
		}
		else if (hours > 0) {
			res = `${hours}h ${minutes}min ${seconds}sec`
		}
		else if (minutes > 0) {
			res = `${minutes}min ${seconds}sec`
		}
		else
			res = `${seconds}sec`

		return (
			<Typography>{res}</Typography>
		);
	}

	const handleViewMatch = (match: Match) => {
		navigate(`${apiGame}/${match.hash}`);
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
			<MyAppBarClose setOpen={setOpen} />
			<DialogContent>
				<Typography variant="h4" style={{fontFamily: "Myriad Pro", color: "white"}}>Matchs en cours :</Typography>
				<Stack sx={{backgroundColor: 'white', height: 0.9, width: 1, borderRadius: 5}}>
					<TableContainer sx={{borderRadius: 5}}>
						<Table>
							<TableHead sx={{backgroundColor: "orange"}}>
								<TableRow>
									<TableCell align="center">
										<Typography style={{fontFamily: "Myriad Pro"}}>Id</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography style={{fontFamily: "Myriad Pro"}}>Time</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography style={{fontFamily: "Myriad Pro"}}>Login 1</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography style={{fontFamily: "Myriad Pro"}}>Login 2</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography style={{fontFamily: "Myriad Pro"}}>View</Typography>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{matchsProgress.map((match) => (
									<TableRow key={match.id}>
										<TableCell align="center">
											<Typography>{match.id}</Typography>
										</TableCell>
										<TableCell align="center">
											<HandleTimeMatch match={match}/>
										</TableCell>
										<TableCell align="center">
											<Typography>{match.player1_login}</Typography>
										</TableCell>
										<TableCell align="center">
											<Typography>{match.player2_login}</Typography>
										</TableCell>
										<TableCell align="center">
											<IconButton onClick={() => handleViewMatch(match)}>
												<RemoveRedEyeIcon />
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

export default MatchProgress;