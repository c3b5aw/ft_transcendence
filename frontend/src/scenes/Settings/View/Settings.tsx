import { Avatar, Badge, Box, Button, FormControlLabel, FormGroup, Stack, Switch, TextField } from "@mui/material";
import axios from "axios";
import React, { SetStateAction, useEffect, useState } from "react";
import { api, api2fa, apiAuth, apiMe } from "../../../Services/Api/Api";
import { User, USER_STATUS } from "../../../Services/Interface/Interface";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import MyFooter from "../../../components/MyFooter";
import { styleTextField } from "../../../styles/Styles";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import { styleStack, sxButton } from "../Services/style";
import { useSnackbar } from 'notistack'
import MyFactorAuth from "../../../components/MyFactorAuth";

const Settings = () => {
	const [me, setMe] = useState<User>();
	const classes = styleTextField()
	const classes2 = styleStack()
	const [new_display, setNewDisplay] = useState<string>("");
	const [new_displayTmp, setNewDisplayTmp] = useState<string>("");
	const [event, setEvent] = useState<Date>();
	const [reload, setReload] = useState<boolean>(false);
	const { enqueueSnackbar } = useSnackbar();
	const [checked, setChecked] = useState(false);
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
	}, [enqueueSnackbar, reload, new_display]);

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
		setChecked(!checked);
		if (!checked) {
			setOpenQrcode(true);
		}
		else {
			await axios.get(`${api}${api2fa}/turn-off`);
		}
	};

	return (
		<Stack direction="row" sx={{width: "100%", height: "100vh"}}>
			<Stack direction="column" sx={{width: 0.97, height: 1}} justifyContent="center" alignItems="center">
				<Stack sx={{ width: 1, height: 1/6, marginLeft: 10}} direction="row" alignItems="center" justifyContent="space-between">
					<Stack direction="row" alignItems="center" spacing={3}>
						<Stack>
							<Avatar
								sx={{ width: "126px", height: "126px" }}
								src={reload ? `http://127.0.0.1/api/profile/avatar` : `http://127.0.0.1/api/users/${me.login}/avatar`}>
							</Avatar>
							<h3 style={{ color: 'grey' }}>{event?.toDateString()}</h3>
						</Stack>
						<div style={{fontFamily: "Myriad Pro", marginBottom: 50, fontSize: "31px"}}>{me.display_name} ({me.role})
							<Badge badgeContent={""} 
								color={me.status === USER_STATUS.ONLINE ? "success" :
								me.status === USER_STATUS.IN_GAME ? "warning" : "error"} style={{marginLeft: "21px"}}>
							</Badge>
						</div>
					</Stack>
					<Button sx={sxButton} onClick={handleLogout}>Logout</Button>
				</Stack>
				<Stack direction="row" spacing={3} sx={{ width: 1, height: 1/5}} className={classes2.root}>
					<AddPhotoAlternateIcon sx={{ fontSize: 55 }} />
					<Box alignItems='center' display='flex' justifyContent='center' flexDirection='column'>
						{/* <form action="/api/profile/avatar" encType="multipart/form-data" method="POST">
							<input type="file" name="avatar" />
							<input type="submit" value="Upload a file"/>
						</form> */}
						<Stack direction="row" spacing={3}>
							<Button variant="contained" component="label">
								{img?.name ?? "Choose file"}
								<input onChange={handleImageChange} type="file" hidden />
							</Button>
							<Box marginY={3}>
								<Button sx={{backgroundColor: "green", color: "white"}} onClick={handleSubmit}>Upload file</Button>
							</Box>
						</Stack>
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
					<FormControlLabel control={
						<Switch
      						checked={checked}
      						onChange={handleChange}
      						inputProps={{ 'aria-label': 'controlled' }}
    					/>} label="Active 2fa" />
				</Stack>
				<Stack direction="row" sx={{width: 1, height: 0.08}}>
					<MyFooter me={me}/>
				</Stack>
			</Stack>
			{openQrcode ? <MyFactorAuth setOpenQrcode={setOpenQrcode} turnon={true}/> : null}
		</Stack>
	);
}

export default Settings;