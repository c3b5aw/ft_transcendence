import { Stack } from "@mui/material";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import MyInfosUser from "../Components/MyInfosUser";
import useMe from "../../../Services/Hooks/useMe";
import useUsers from "../../../Services/Hooks/useUsers";
import useCountMatchs from "../Services/useCountMatchs";
import MyFooter from "../../../components/MyFooter";
import { PAGE } from "../../../Services/Interface/Interface";

function Admin() {
	const me = useMe();
	const users = useUsers();
	const countMatchs = useCountMatchs();

	if ((me === undefined || users === undefined || countMatchs === undefined))
		return (<MyChargingDataAlert />);
	return (
		<Stack
			direction="column"
			spacing={5}
		>
			<MyFooter me={me} currentPage={PAGE.ADMINVIEW}/>
			<Stack direction="column">
				<Stack
					sx={{width: 1, height: 0.9}}
					direction="row"
					justifyContent="center"
				>
					<Stack
						sx={{ width: 0.9, height: 1 }}
						direction="column"
						alignItems="center"
						justifyContent="center"
					>
						<MyInfosUser />
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
}

export default Admin;