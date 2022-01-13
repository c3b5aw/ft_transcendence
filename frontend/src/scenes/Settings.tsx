import { Avatar, Box, Button, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import MyListFriends from "../components/MyListFriends";
import { api, apiMe } from "../services/Api/Api";
import { User } from "../services/Interface/Interface";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';
import MyFooter from "../components/MyFooter";

const buttonStyle = {
	backgroundColor: "white",
	borderRadius: 4,
	border: 5,
	width: "12%",
	height: "24%",
	color: "black",
	fontStyle: "bold",
	fontFamily: "Myriad Pro",
	fontSize: "18px",
	':hover': {
		bgcolor: '#D3D3D3', // theme.palette.primary.main
		color: 'black',
	  },
};

const Settings = () => {
	const [me, setMe] = useState<User>();

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
			}
			catch (err) {
				console.log(err);
			}
		}
		fetchMe();
	}, [])
	return (
		<Stack direction="row" sx={{width: 1, height: "100vh"}}>
			<Stack direction="column" sx={{width: 0.8, height: 1}} justifyContent="center" alignItems="center">
				<Stack sx={{ width: 1, height: 1/6, marginLeft: 10}} direction="row" alignItems="center" spacing={3}>
					<Stack>
						<Avatar
							sx={{ width: "126px", height: "126px" }}
							src={`http://127.0.0.1/api/profile`}>
						</Avatar>
						<h3 style={{ color: 'grey' }}>Join le 03/01/2022</h3>
					</Stack>
					<h1 style={{fontFamily: "Myriad Pro", marginBottom: 50}}>{me?.login}</h1>
				</Stack>
				<Stack sx={{ width: 1, height: 1/5}} direction="row" justifyContent="center" alignItems="center" spacing={3}>
					<AddPhotoAlternateIcon sx={{ fontSize: 55 }} />
					<Button sx={buttonStyle}>Edit avatar</Button>
				</Stack>
				<Stack sx={{ width: 1, height: 1/5}} direction="row" justifyContent="center" alignItems="center" spacing={3}>
					<EditIcon sx={{ fontSize: 55 }} />
					<Button sx={buttonStyle}>Edit username</Button>
				</Stack>
				<Stack sx={{ width: 1, height: 1/5}} direction="row" justifyContent="center" alignItems="center" spacing={3}>
					<KeyIcon sx={{ fontSize: 55 }} />
					<Button sx={buttonStyle}>Remove / Setup</Button>
				</Stack>
				<Box component="footer" sx={{ width: 1, height: '25vh'}}>
					<MyFooter me={me}/>
				</Box>
			</Stack>
			<Stack sx={{ width: 0.2, height: 1, backgroundColor: "red"}} direction="column">
				<MyListFriends me={me}/>
			</Stack>
		</Stack>
	);
}

export default Settings;