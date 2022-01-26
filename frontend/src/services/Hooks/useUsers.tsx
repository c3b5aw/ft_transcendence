import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiUsers } from "../Api/Api";
import { User } from "../Interface/Interface";
import { useSnackbar } from 'notistack'

function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
	const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}`);
				setUsers(response.data);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de récupérer la liste des users (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchUsers();
	}, [enqueueSnackbar]);

    return (users);
}

export default useUsers;