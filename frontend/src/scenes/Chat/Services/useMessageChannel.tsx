import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiChannel, apiMessages } from "../../../Services/Api/Api";
import { Message } from "./interface";
import { useSnackbar } from 'notistack'

function useMessageChannel(nameChannel : string) {
	const { enqueueSnackbar } = useSnackbar();
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		const fetchMessagesChannel = async () => {
		try {
			const reponse = await axios.get(`${api}${apiChannel}/${nameChannel}${apiMessages}`);
			setMessages(reponse.data);
		}
		catch (err) {
			enqueueSnackbar(`Impossible de charger les messages du channel ${nameChannel} (${err})`, { 
				variant: 'error',
				autoHideDuration: 3000,
			});
		}
	}
		fetchMessagesChannel();
	}, [enqueueSnackbar, nameChannel]);
	
	return (messages);
}

export default useMessageChannel;