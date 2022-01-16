import { Avatar, Box, Button, Stack, TextField } from "@mui/material";
import axios from "axios";
import { SetStateAction, useEffect, useState } from "react";
import { api, apiMe, rolesArray } from "../services/Api/Api";
import { User } from "../services/Interface/Interface";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import MyFooter from "../components/MyFooter";
import { styleTextField } from "../styles/Styles";
import MyChargingDataAlert from "../components/MyChargingDataAlert";
import MyError from "../components/MyError";

const Settings = () => {
	const [me, setMe] = useState<User>();
	const classes = styleTextField()
	const [new_display, setNewDisplay] = useState<string>("");
	const [event, setEvent] = useState<Date>();
	const [error, setError] = useState<unknown>("");

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
				return reponse;
			}
			catch (err) {
				setError(err);
			}
		}
		async function fetchCreated() {
			const result = await fetchMe();
			setEvent(new Date(result?.data.created))
		}
		fetchCreated();
	}, [new_display]);

	const  handleTextInputChange = async (event: { target: { value: SetStateAction<string>; }; }) => {
		if (event.target.value.length > 3)
		{
			try {
				const reponse = await axios.post(`${api}${apiMe}/display_name`, {
					display_name: `${event.target.value}`
				})
				if (reponse.status === 201) {
					setNewDisplay(event.target.value);
				}
			}
			catch (err) {
				setError(err);
			}
		}
    };

	// eslint-disable-next-line eqeqeq
	if (me == undefined && error === "")
		return (<MyChargingDataAlert />);
	// eslint-disable-next-line eqeqeq
	else if (error !== "" || me == undefined)
		return (<MyError error={error}/>);
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
					<h1 style={{fontFamily: "Myriad Pro", marginBottom: 50}}>{me.display_name} ({me.role != undefined ? rolesArray[me.role] : null})</h1>
				</Stack>
				<Stack sx={{ width: 1, height: 1/5}} direction="row" justifyContent="center" alignItems="center" spacing={3}>
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
				<Stack sx={{ width: 1, height: 1/5}} direction="row" justifyContent="center" alignItems="center" spacing={3}>
					<EditIcon sx={{ fontSize: 55 }} />
					<TextField
						className={classes.searchBarStyle}
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
				</Stack>
				<Stack sx={{ width: 1, height: 1/5}} direction="row" justifyContent="center" alignItems="center" spacing={3}>
					<KeyIcon sx={{ fontSize: 55 }} />
					<Button sx={{
						border: "4px solid black",
						borderRadius: "5px",
						color: "black",
						fontFamily: "Myriad Pro",
						padding: "15px",
						backgroundColor: "white",
						fontSize: "17px",
						'&:hover': {
							backgroundColor: '#D5D5D5',
							color: '#000000',
						},
					}}>
					Remove / Setup</Button>
				</Stack>
				<Stack direction="row" sx={{width: 1, height: 0.08}}>
					<MyFooter me={me}/>
				</Stack>
			</Stack>
			{/* <Stack sx={{ width: 0.2, height: 1, backgroundColor: "red"}} direction="column">
				<MyList me={me} url={`${api}${apiUsers}/${me?.login}${apiFriends}`}/>
			</Stack> */}
		</Stack>
	);
}

export default Settings;