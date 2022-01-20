import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiMe } from "../Api/Api";
import { User } from "../Interface/Interface";
import { useSnackbar } from 'notistack'

function useMe() {
	const [me, setMe] = useState<User>();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
			} catch (err) {
				enqueueSnackbar(`Impossible de recuperer les informations te concernant (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchMe();
	}, [enqueueSnackbar])
	return (me);
}

export default useMe;