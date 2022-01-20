import { Avatar, Box, Button, Stack, TextField } from "@mui/material";
import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { api, apiMe } from "../../../services/Api/Api";
import { User } from "../../../services/Interface/Interface";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import MyFooter from "../../../components/MyFooter";
import { styleTextField } from "../../../styles/Styles";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import { styleStack, sxButton } from "../Services/style";
import { useSnackbar } from 'notistack'

const Settings = () => {
	const [me, setMe] = useState<User>();
	const classes = styleTextField()
	const classes2 = styleStack()
	const [new_display, setNewDisplay] = useState<string>("");
	const [new_displayTmp, setNewDisplayTmp] = useState<string>("");
	const [event, setEvent] = useState<Date>();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
				return reponse;
			}
			catch (err) {
				enqueueSnackbar(`Impossible de recuperer les informations te concernant (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		async function fetchCreated() {
			const result = await fetchMe();
			setEvent(new Date(result?.data.created))
		}
		fetchCreated();
	}, [enqueueSnackbar, new_display]);

	const  handleTextInputChange = async (event: { target: { value: SetStateAction<string>; }; }) => {
		setNewDisplayTmp(event.target.value);
	};

	async function handleSendNewDisplayName() {
		if (new_displayTmp.length > 3) {
			try {
				await axios.post(`${api}${apiMe}/display_name`, {
					display_name: `${new_displayTmp}`
				})
				setNewDisplay(new_displayTmp);
				enqueueSnackbar(`Le dislay_name a été mis a jour`, { 
					variant: 'success',
					autoHideDuration: 3000,
				});
			}
			catch (err) {
				enqueueSnackbar(`Impossible de mettre a jour le display name (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		else {
			enqueueSnackbar(`Le display_name doit contenir au moins 3 caractères`, { 
				variant: 'warning',
				autoHideDuration: 3000,
			});
		}
	}

	if (me === undefined)
		return (<MyChargingDataAlert />);
	return (
		<Stack direction="row" sx={{width: "100%", height: "100vh"}}>
			<Stack direction="column" sx={{width: 0.97, height: 1}} justifyContent="center" alignItems="center">
				<Stack sx={{ width: 1, height: 1/6, marginLeft: 10}} direction="row" alignItems="center" spacing={3}>
					<Stack>
						<Avatar
							sx={{ width: "126px", height: "126px" }}
							src={`http://127.0.0.1/api/profile/avatar`}>
						</Avatar>
						<h3 style={{ color: 'grey' }}>{event?.toDateString()}</h3>
					</Stack>
					<h1 style={{fontFamily: "Myriad Pro", marginBottom: 50}}>{me.display_name} ({me.role})</h1>
				</Stack>
				<Stack direction="row" spacing={3} sx={{ width: 1, height: 1/5}} className={classes2.root}>
					<AddPhotoAlternateIcon sx={{ fontSize: 55 }} />
					<Box alignItems='center' display='flex' justifyContent='center' flexDirection='column'>
						<form action="http://127.0.0.1/api/profile/avatar" method="post">
							<input type="file"
								id="Choose your new avatar" name="Choose your new avatar"
								accept="image/jpeg"/>
							<button>Send</button>
						</form>
					</Box>
				</Stack>
				<Stack direction="row" spacing={3} sx={{ width: 1, height: 1/5}} className={classes2.root}>
					<EditIcon sx={{ fontSize: 55 }} />
					<TextField
						className={classes.styleTextField}
						required
						id="outlined-required"
						label={`${me.display_name}`}
						defaultValue=""
						onChange= {handleTextInputChange}
						InputProps={{
							style: {
								color: "white",
							}
						}}
						InputLabelProps={{
							style: { color: '#ADADAD' },
						  }}
					/>
					<Button sx={sxButton} onClick={() => handleSendNewDisplayName()}>Valider</Button>
				</Stack>
				<Stack direction="row" spacing={3} sx={{ width: 1, height: 1/5}} className={classes2.root}>
					<KeyIcon sx={{ fontSize: 55 }} />
					<Button sx={sxButton}>Remove / Setup</Button>
				</Stack>
				<Stack direction="row" sx={{width: 1, height: 0.08}}>
					<MyFooter me={me}/>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default Settings;