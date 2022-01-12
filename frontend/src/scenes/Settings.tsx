import { Avatar, Stack } from "@mui/material";
import { useContext } from "react";
import { MeContext } from "../MeProvider";
import { ContextType } from "../services/Api/type.d";

const Settings = () => {

	const { user } = useContext(MeContext) as ContextType;

	return (
		<Stack direction="row" sx={{width: 1, height: "100vh", backgroundColor: "orange"}}>
			<Stack direction="column" sx={{width: 0.8, height: 1, backgroundColor: "green"}}>
				<Stack sx={{ width: 1, height: 1/4, marginLeft: 10}} direction="row" alignItems="center" spacing={3}>
					<Avatar
						sx={{ width: "126px", height: "126px" }}>
					</Avatar>
					<h1 style={{fontFamily: "Myriad Pro"}}>{user.login}</h1>
				</Stack>
			</Stack>
			<Stack sx={{ width: 0.2, height: 1, backgroundColor: "red"}} direction="column">
				{/* <MyListFriends items={users}/> */}
			</Stack>
		</Stack>
	);
}

export default Settings;