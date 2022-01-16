import { Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import MyAvatar from "../components/MyAvatar";
import MyChargingDataAlert from "../components/MyChargingDataAlert";
import MyError from "../components/MyError";
import MyInfosUser from "../components/MyInfosUser";
import MySnackBar from "../components/MySnackbar";
import { api, apiMatch, apiMe, apiUsers } from "../services/Api/Api";
import { User } from "../services/Interface/Interface";

function Admin() {
	const [me, setMe] = useState<User>();
	const [users, setUsers] = useState<User[]>([]);
	const [countMatchs, setCountMatchs] = useState<number>();
	const [error, setError] = useState<unknown>("");

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
			} catch (err) {
				setError(err);
			}
		}
		fetchMe();
	}, [])

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}`);
				setUsers(response.data);
			}
			catch (err) {
				setError(err);
			}
		}
		fetchUsers();
	}, []);

	useEffect(() => {
		const fetchCountMatchs = async () => {
			try {
				const response = await axios.get(`${api}${apiMatch}/count`);
				setCountMatchs(response.data.total);
			}
			catch (err) {
				setError(err);
			}
		}
		fetchCountMatchs();
	}, []);

	// eslint-disable-next-line eqeqeq
	if ((me == undefined || users == undefined || countMatchs == undefined) && error === "")
		return (<MyChargingDataAlert />);
	// eslint-disable-next-line eqeqeq
	else if (error !== "" || me == undefined)
		return (<MyError error={error}/>);
	return (
		<Stack sx={{width: 1, height: 1}} direction="row" alignItems="center" justifyContent="center">
			<Stack direction="column" sx={{width: 0.2, height: "100vh"}}>
				<MyAvatar user={me}/>
				<h2>Nombre de matchs : {countMatchs}</h2>
				<h2>Nombre de joueurs : {users.length}</h2>
			</Stack>
			<Stack sx={{ width: 0.78, height: "100vh"}} direction="column" alignItems="center" justifyContent="center">
				<MyInfosUser me={me} users={users}/>
			</Stack>
			<MySnackBar message="Données chargées" severity="success" time={2000}/>
		</Stack>
	);
}

export default Admin;