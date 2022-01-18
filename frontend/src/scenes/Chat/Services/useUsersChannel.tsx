import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiChannel, apiUsers } from "../../../services/Api/Api";
import { User } from "../../../services/Interface/Interface";
import { Channel } from "./interface";

function useUsersChannel(channel: Channel) {
    const [usersChannel, setUsersChannel] = useState<User[]>([]);

    useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${api}${apiChannel}/${channel.name}${apiUsers}`);
				setUsersChannel(response.data);
			}
			catch (err) {
				// console.log(err);
			}
		}
		fetchUsers();
	}, [channel.name]);

    return (usersChannel);
}

export default useUsersChannel;