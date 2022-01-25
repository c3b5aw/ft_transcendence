import axios from "axios";
import { useEffect, useState } from "react";
import { useSnackbar } from 'notistack'
import { api, apiChannels } from "../../../../Services/Api/Api";
import { Channel } from "../interface";

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