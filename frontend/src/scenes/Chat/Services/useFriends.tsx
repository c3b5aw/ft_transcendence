import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiFriends, apiMe } from "../../../Services/Api/Api";
import { useSnackbar } from 'notistack'
import { User } from "../../../Services/Interface/Interface";

function useFriends() {
	const { enqueueSnackbar } = useSnackbar();
	const [friends, setFriends] = useState<User[]>([]);

	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const response = await axios.get(`${api}${apiMe}${apiFriends}`);
				setFriends(response.data);
			}
			catch (err) {
				enqueueSnackbar(`${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchFriends();
	}, [enqueueSnackbar]);
	return (friends);
}

export default useFriends;