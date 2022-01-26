import axios from "axios";
import { useEffect, useState } from "react";
import { useSnackbar } from 'notistack'
import { Channel } from "../interface";
import { User } from "../../../../Services/Interface/Interface";
import { api, apiChannel, apiUsers } from "../../../../Services/Api/Api";

function useUsersChannel(channel: Channel) {
	const { enqueueSnackbar } = useSnackbar();
    const [usersChannel, setUsersChannel] = useState<User[]>([]);

    useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${api}${apiChannel}/${channel.name}${apiUsers}`);
				setUsersChannel(response.data);
			}
			catch (err) {
				enqueueSnackbar(`${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchUsers();
	}, [channel.name, enqueueSnackbar]);
    return (usersChannel);
}

export default useUsersChannel;