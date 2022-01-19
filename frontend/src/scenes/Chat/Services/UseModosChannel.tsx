import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiChannel, apiModos } from "../../../services/Api/Api";
import { User } from "../../../services/Interface/Interface";
import { Channel } from "./interface";

function useModosChannel(channel: Channel) {
    const [modosChannel, setModosChannel] = useState<User[]>([]);

    useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${api}${apiChannel}/${channel.name}${apiModos}`);
				setModosChannel(response.data);
			}
			catch (err) {
				// console.log(err);
			}
		}
		fetchUsers();
	}, [channel.name]);

    return (modosChannel);
}

export default useModosChannel;