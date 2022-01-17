import React from "react";
import { User } from "../services/Interface/Interface";
import axios from "axios";
import { api, apiUsers } from "../services/Api/Api";
import MyChargingDataAlert from "./MyChargingDataAlert";
import MyDialog from "./MyDialog";

function MyCreateChannel () {
	const [users, setFriends] = React.useState<User[]>([]);

	React.useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}`);
				setFriends(response.data);
			}
			catch (err) {
				console.log(err);
			}
		}
		fetchUsers();
	}, []);
	// eslint-disable-next-line eqeqeq
	if (users == undefined)
		return (<MyChargingDataAlert />);
	return (
		<MyDialog users={users}/>
	);
}

export default MyCreateChannel;