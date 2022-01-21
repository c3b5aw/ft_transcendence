import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiChannels } from "../../../Services/Api/Api";
import { useSnackbar } from 'notistack'
import { Channel } from "./interface";

function useFirstChannel() {
	const { enqueueSnackbar } = useSnackbar();
	const [channels, setChannels] = useState<Channel[]>([]);

	useEffect(() => {
		const fetchFirstChannel = async () => {
			try {
				const response = await axios.get(`${api}${apiChannels}/`);
				setChannels(response.data);
			}
			catch (err) {
				enqueueSnackbar(`${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchFirstChannel();
	}, [enqueueSnackbar]);
	return (channels);
}

export default useFirstChannel;