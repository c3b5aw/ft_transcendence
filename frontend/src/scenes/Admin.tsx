import { Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import MyAvatar from "../components/MyAvatar";
import MyInfosUser from "../components/MyInfosUser";
import { api, apiMatch, apiMe, apiUsers } from "../services/Api/Api";
import { User } from "../services/Interface/Interface";

function Admin() {
	const [me, setMe] = useState<User>();
	const [users, setUsers] = useState<User[]>([]);
	const [countMatchs, setCountMatchs] = useState<number>();

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchMe();
	}, [])

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await axios.get(`${api}${apiUsers}`);
			setUsers(response.data);
		}
		fetchUsers();
	}, []);

	useEffect(() => {
		const fetchCountMatchs = async () => {
			const response = await axios.get(`${api}${apiMatch}/count`);
			setCountMatchs(response.data.total);
		}
		fetchCountMatchs();
	}, []);
	return (
		<Stack sx={{width: 1, height: 1}} direction="row" alignItems="center" justifyContent="center">
			<Stack direction="column" sx={{width: 0.2, height: "100vh"}}>
				<MyAvatar login={me?.login} role={me?.role}/>
				<h2>Nombre de matchs : {countMatchs}</h2>
				<h2>Nombre de joueurs : {users.length}</h2>
			</Stack>
			<Stack sx={{ width: 0.78, height: "100vh"}} direction="column" alignItems="center" justifyContent="center">
				<MyInfosUser me={me} users={users}/>
			</Stack>
		</Stack>
	);
}

export default Admin;