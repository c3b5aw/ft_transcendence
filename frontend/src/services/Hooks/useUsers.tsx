import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiUsers } from "../Api/Api";
import { User } from "../Interface/Interface";

function useUsers() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}`);
				setUsers(response.data);
			}
			catch (err) {
				// console.log(err);
			}
		}
		fetchUsers();
	}, []);

    return (users);
}

export default useUsers;