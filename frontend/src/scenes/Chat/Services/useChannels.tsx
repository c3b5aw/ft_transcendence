import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiChannels } from "../../../services/Api/Api";
import { Channel } from "./interface";
import { useSnackbar } from 'notistack'

function useChannels() {
	const { enqueueSnackbar } = useSnackbar();
    const [channels, setChannels] = useState<Channel[]>([]);

    useEffect(() => {
		const fetchChannels = async () => {
			try {
				const response = await axios.get(`${api}${apiChannels}`);
				setChannels(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de récupérer la liste des channels (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchChannels();
	}, [enqueueSnackbar]);
    return (channels);
}

export default useChannels;