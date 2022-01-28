import { Stack } from "@mui/material";
import MyAvatar from "../../../components/MyAvatar";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import MyInfosUser from "../Components/MyInfosUser";
import useMe from "../../../Services/Hooks/useMe";
import useUsers from "../../../Services/Hooks/useUsers";
import useCountMatchs from "../Services/useCountMatchs";
import MyFooter from "../../../components/MyFooter";

function Admin() {
	const me = useMe();
	const users = useUsers();
	const countMatchs = useCountMatchs();

	if ((me === undefined || users === undefined || countMatchs === undefined))
		return (<MyChargingDataAlert />);
	return (
		<Stack direction="column">
			<MyFooter me={me}/>
			<div style={{margin: 10}} />
			<Stack sx={{width: 1, height: 1}} direction="row" justifyContent="center">
				<Stack direction="column" sx={{width: 0.2, height: "50%"}} spacing={5} justifyContent="space-between">
					<MyAvatar user={me}/>
				</Stack>
				<Stack sx={{ width: 0.78, height: "100%"}} direction="column" alignItems="center" justifyContent="center">
					<MyInfosUser />
				</Stack>
			</Stack>
		</Stack>
	);
}

export default Admin;