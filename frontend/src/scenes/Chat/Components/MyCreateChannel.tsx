import React from "react";
import MyChargingDataAlert from "../../../components/MyChargingDataAlert";
import MyDialog from "./MyDialog";
import useUsers from "../../../services/Hooks/useUsers";

function MyCreateChannel () {
	const users = useUsers();

	// eslint-disable-next-line eqeqeq
	if (users == undefined)
		return (<MyChargingDataAlert />);
	return (
		<MyDialog users={users}/>
	);
}

export default MyCreateChannel;