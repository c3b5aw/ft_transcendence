import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiChannel, apiModos } from "../../../services/Api/Api";
import { User } from "../../../services/Interface/Interface";
import { Channel } from "./interface";
import { useSnackbar } from 'notistack'

function useModosChannel(channel: Channel) {
    const [modosChannel, setModosChannel] = useState<User[]>([]);
	const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
		const fetchModosChannel = async () => {
			try {
				const response = await axios.get(`${api}${apiChannel}/${channel.name}${apiModos}`);
				setModosChannel(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de récuperer la liste des modérateur du channel ${channel.name} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchModosChannel();
	}, [channel.name, enqueueSnackbar]);
	return (modosChannel);
}

export default useModosChannel;