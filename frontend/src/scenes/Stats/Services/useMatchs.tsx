import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiMatch, apiUsers } from "../../../Services/Api/Api";
import { Match, User } from "../../../Services/Interface/Interface";
import { useSnackbar } from 'notistack'

function useMatchs(user: User) {
    const [matchs, setMatchs] = useState<Match[]>();
	const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
		const fetchMatchs = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}/${user.login}${apiMatch}`);
				setMatchs(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de charger les matchs de ${user.login} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchMatchs();
	}, [enqueueSnackbar, user.login]);
    return matchs;
}

export default useMatchs;