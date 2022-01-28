import { Avatar, Badge, Box, Button, createTheme, FormControlLabel, FormGroup, responsiveFontSizes, Stack, Switch, TextField, ThemeProvider } from "@mui/material";
import axios from "axios";
import React, { SetStateAction, useEffect, useState } from "react";
import { api, api2fa, apiAuth, apiMe } from "../../../Services/Api/Api";
import { User, USER_STATUS } from "../../../Services/Interface/Interface";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import MyFooter from "../../../components/MyFooter";
import { buttonStyle, styleTextField } from "../../../styles/Styles";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import { styleStack, sxButton } from "../Services/style";
import { useSnackbar } from 'notistack'
import MyFactorAuth from "../../../components/MyFactorAuth";
import Typography from '@mui/material/Typography';

const Settings = () => {
	const [me, setMe] = useState<User>();
	const classes = styleTextField()
	const classes2 = styleStack()
	const [new_display, setNewDisplay] = useState<string>("");
	const [new_displayTmp, setNewDisplayTmp] = useState<string>("");
	const [event, setEvent] = useState<Date>();
	const [reload, setReload] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();
	const [openQrcode, setOpenQrcode] = useState(false);

	const [img, setImg] = useState<File | null>();

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
				return (reponse);
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
			setEvent(new Date(result?.data.created));
		}
		fetchCreated();
	}, [enqueueSnackbar, reload, new_display, openQrcode]);

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
					autoHideDuration: 2000,
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

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setImg(event.target.files ? event.target.files[0] : null)
	};

	const uploadForm = async (formData: FormData) => {
		try {
			await axios.post("/api/profile/avatar", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			setReload(!reload);
		} catch (err) {
			enqueueSnackbar(`Impossible de mettre a jour l'avatar (format : .jpeg / .jpg) (${err})`, { 
				variant: 'error',
				autoHideDuration: 3000,
			});
		}
	};
	
	const handleSubmit = async () => {
		const formData = new FormData();
		img && formData.append("avatar", img);
		return (await uploadForm(formData));
	};

	const handleLogout = async () => {
		window.location.href = `${api}${apiAuth}/logout`
	}

	const handleChange = async () => {
		if (!me.two_factor_auth) {
			setOpenQrcode(true);
		}
		else {
			await axios.get(`${api}${api2fa}/turn-off`);
		}
	};

	let theme = createTheme();
	theme = responsiveFontSizes(theme);

	return (
		<ThemeProvider theme={theme}>
			<MyFooter me={me}/>
			<Stack direction="row" sx={{width: "100%", height: "100%"}}>
				<Stack direction="column" sx={{width: 0.97, height: 1}} justifyContent="center" alignItems="center">
					<Stack sx={{ width: 0.9, height: "15em"}} direction="row" alignItems="center" justifyContent="space-between">
						<Stack direction="row" alignItems="center" spacing={3}>
							<Avatar
								sx={{ width: {xs: "96px", sm: "96px", md: "96px", lg: "128px"}, height: {xs: "96px", sm: "96px", md: "96px", lg: "128px"} }}
								src={reload ? `http://127.0.0.1/api/profile/avatar` : `http://127.0.0.1/api/users/${me.login}/avatar`}>
							</Avatar>
							<Stack>
								<Typography variant="h4" style={{fontFamily: "Myriad Pro"}}>{me.display_name} ({me.role})</Typography>
								<Typography variant="h5" style={{color: 'grey'}}>{event?.toDateString()}</Typography>
							</Stack>
						</Stack>
						<Button variant="contained" sx={{color: "white"}} onClick={handleLogout}>
							<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Logout</Typography>
						</Button>
					</Stack>
					<Stack direction="row" spacing={3} sx={{ width: 1, height: "15em"}} className={classes2.root}>
						<AddPhotoAlternateIcon sx={{ width: {xs: "48px", sm: "64px", md: "64px", lg: "64px"}, height: {xs: "48px", sm: "64px", md: "64px", lg: "64px"} }} />
						<Box alignItems='center' display='flex' justifyContent='center' flexDirection='column'>
							<Stack direction="row" spacing={3}>
								<Button variant="contained" component="label">
									<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>{img?.name ?? "Choose file"}</Typography>
									<input onChange={handleImageChange} type="file" hidden />
								</Button>
								<Box marginY={3}>
									<Button sx={{backgroundColor: "green", color: "white"}} onClick={handleSubmit}>
										<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Upload file</Typography>
									</Button>
								</Box>
							</Stack>
						</Box>
					</Stack>
					<Stack direction="row" spacing={3} sx={{ width: 1, height: "15em"}} className={classes2.root}>
						<EditIcon sx={{ width: {xs: "48px", sm: "64px", md: "64px", lg: "64px"}, height: {xs: "48px", sm: "64px", md: "64px", lg: "64px"} }} />
						<TextField
							className={classes.styleTextField}
							sx={{width: {xs: "200px", sm: "200px", md: "300px", lg: "400px"}}}
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
						<Button sx={{backgroundColor: "green", color: "white", fontSize: "0.7rem"}} onClick={handleSendNewDisplayName}>
							<Typography variant="h6" style={{fontFamily: "Myriad Pro"}}>Valider</Typography>
						</Button>
					</Stack>
					<Stack direction="row" spacing={{xs: 1, sm: 2, md: 3}} sx={{ width: 1, height: "15em"}} className={classes2.root}>
						<KeyIcon sx={{ width: {xs: "48px", sm: "64px", md: "64px", lg: "64px"}, height: {xs: "48px", sm: "64px", md: "64px", lg: "64px"} }} />
						<FormControlLabel control={
							<Switch
								checked={me.two_factor_auth}
								onChange={handleChange}
								inputProps={{ 'aria-label': 'controlled' }}
							/>} label="Active 2fa" />
					</Stack>
				</Stack>
				{openQrcode ? <MyFactorAuth setOpenQrcode={setOpenQrcode} turnon={true}/> : null}
			</Stack>
		</ThemeProvider>
	);
}

export default Settings;