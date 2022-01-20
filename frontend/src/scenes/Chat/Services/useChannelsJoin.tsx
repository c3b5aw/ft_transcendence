import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiChannels } from "../../../services/Api/Api";
import { Channel } from "./interface";
import { useSnackbar } from 'notistack'

function useChannelsJoin() {
	const { enqueueSnackbar } = useSnackbar();
    const [channelsJoin, setChannelsJoin] = useState<Channel[]>([]);

    useEffect(() => {
		const fetchChannelsJoin = async () => {
			try {
				const response = await axios.get(`${api}${apiChannels}/joined`);
				setChannelsJoin(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de récupérer la liste des channels que tu as join(${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchChannelsJoin();
	}, [enqueueSnackbar]);
    return (channelsJoin);
}

export default useChannelsJoin;