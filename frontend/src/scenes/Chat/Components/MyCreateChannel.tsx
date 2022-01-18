import React from "react";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import useUsers from "../../../services/Hooks/useUsers";
import MyDialogCreateChannel from "./MyDialogCreateChannel";

function MyCreateChannel () {
	const users = useUsers();

	// eslint-disable-next-line eqeqeq
	if (users == undefined)
		return (<MyChargingDataAlert />);
	return (
		<MyDialogCreateChannel users={users}/>
	);
}

export default MyCreateChannel;