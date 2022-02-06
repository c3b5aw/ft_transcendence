import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiFriends, apiUsers } from "../../../Services/Api/Api";
import { Friend, User } from "../../../Services/Interface/Interface";
import { useSnackbar } from 'notistack'

function useFriends(user: User) {
	const { enqueueSnackbar } = useSnackbar();
	const [friends, setFriends] = useState<Friend[]>([]);
	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}/${user.login}${apiFriends}`);
				setFriends(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de recupérer les amis de ${user.login} (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchFriends();
	}, [enqueueSnackbar, user.login]);
	return (friends);
}

export default useFriends;