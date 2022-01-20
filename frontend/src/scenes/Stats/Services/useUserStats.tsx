import axios from "axios";
import { useEffect, useState } from "react";
import { apiStats } from "../../../services/Api/Api";
import { User } from "../../../services/Interface/Interface";
import { useSnackbar } from 'notistack'

function useUserStats(login: string | undefined) {
    const [user, setUser] = useState<User>();
	const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
		const fetchUser = async () => {
			try {
				const url = `http://127.0.0.1/api/users/${login}${apiStats}`;
				const reponse = await axios.get(url);
				setUser(reponse.data);
			} catch (err) {
				enqueueSnackbar(`Impossible de charfer les stats de ${login} (${err})`, { 
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