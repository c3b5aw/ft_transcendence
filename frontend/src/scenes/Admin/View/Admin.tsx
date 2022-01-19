import { Stack } from "@mui/material";
import MyAvatar from "../../../components/MyAvatar";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import MyInfosUser from "../Components/MyInfosUser";
import MySnackBar from "../../../components/MySnackbar";
import useMe from "../../../services/Hooks/useMe";
import useUsers from "../../../services/Hooks/useUsers";
import useCountMatchs from "../Services/useCountMatchs";
import { useState } from "react";

function Admin() {
	// const [me, setMe] = useState<User>();
	const me = useMe();
	const users = useUsers();
	const countMatchs = useCountMatchs();
	const [error, setError] = useState<string>("Données chargées");

	if ((me === undefined || users === undefined || countMatchs === undefined))
		return (<MyChargingDataAlert />);
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
			<MySnackBar message={`${error}`} severity="success" time={2000} setError={setError}/>
		</Stack>
	);
}

export default Admin;