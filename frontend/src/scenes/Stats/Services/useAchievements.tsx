import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiAchievements, apiUsers } from "../../../Services/Api/Api";
import { Achievements, User } from "../../../Services/Interface/Interface";
import { useSnackbar } from 'notistack'

function useAchievements(user: User) {
	const { enqueueSnackbar } = useSnackbar();
	const [achievements, setAchievements] = useState<Achievements[]>([]);
	useEffect(() => {
		const fetchAchievements = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}/${user.login}${apiAchievements}`);
				setAchievements(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de charger la liste des achievements (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchAchievements();
	}, [enqueueSnackbar, user.login]);
	return (achievements);
}

export default useAchievements;