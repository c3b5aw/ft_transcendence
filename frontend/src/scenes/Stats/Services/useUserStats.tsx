import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../../../Services/Interface/Interface";
import { useSnackbar } from 'notistack'

function useUserStats(login: string | undefined) {
    const [user, setUser] = useState<User>();
	const { enqueueSnackbar } = useSnackbar();
    useEffect(() => {
		const fetchUser = async () => {
			try {
				const url = `/api/users/${login}/stats`;
				const reponse = await axios.get(url);
				setUser(reponse.data);
			} catch (err) {
				enqueueSnackbar(`Impossible de charger les stats de ${login} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchUser();
	}, [enqueueSnackbar, login])
    return user;
}

export default useUserStats;