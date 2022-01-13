import { Avatar, Button, Icon, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import MyListFriends from "../components/MyListFriends";
import { api, apiMe, apiUsers } from "../services/Api/Api";
import { User } from "../services/Interface/Interface";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import KeyIcon from '@mui/icons-material/Key';

const Settings = () => {
	const [me, setMe] = useState<User>();

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiUsers}${apiMe}`);
				setMe(reponse.data);
			}
			catch (err) {
				console.log(err);
			}
		}
		fetchMe();
	}, [])
	return (
		<Stack direction="row" sx={{width: 1, height: "100vh", backgroundColor: "orange"}}>
			<Stack direction="column" sx={{width: 0.8, height: 1, backgroundColor: "green"}} justifyContent="center" alignItems="center">
				<Stack sx={{ width: 1, height: 1/4, marginLeft: 10, backgroundColor: "magenta"}} direction="row" alignItems="center" spacing={3}>
					<Stack sx={{backgroundColor: 'red'}}>
						<Avatar
							sx={{ width: "126px", height: "126px" }}>
						</Avatar>
						<h3 style={{ color: 'grey' }}>Join le 03/01/2022</h3>
					</Stack>
					<h1 style={{fontFamily: "Myriad Pro", marginBottom: 50}}>eoliveir{me?.login}</h1>
				</Stack>
				<Stack sx={{ width: 1, height: 1/5, backgroundColor: "red"}} direction="row" justifyContent="center" alignItems="center" spacing={3}>
					<AddPhotoAlternateIcon sx={{ fontSize: 55 }} />
					<Button><h3 style={{fontFamily: "Myriad Pro", color: "black", fontSize: "23px"}}>Edit avatar</h3></Button>
				</Stack>
				<Stack sx={{ width: 1, height: 1/5, backgroundColor: "orange"}} direction="row" justifyContent="center" alignItems="center" spacing={3}>
					<EditIcon sx={{ fontSize: 55 }} />
					<Button><h3 style={{fontFamily: "Myriad Pro", color: "black", fontSize: "23px"}}>Edit username</h3></Button>
				</Stack>
				<Stack sx={{ width: 1, height: 1/5, backgroundColor: "blue"}} direction="row" justifyContent="center" alignItems="center" spacing={3}>
					<KeyIcon sx={{ fontSize: 55 }} />
					<Button><h3 style={{fontFamily: "Myriad Pro", color: "black", fontSize: "23px"}}>Remove or setup key auth</h3></Button>
				</Stack>
			</Stack>
			<Stack sx={{ width: 0.2, height: 1, backgroundColor: "red"}} direction="column">
				<MyListFriends me={me}/>
			</Stack>
		</Stack>
	);
}

export default Settings;