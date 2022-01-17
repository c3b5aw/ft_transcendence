import axios from "axios";
import { useEffect, useState } from "react";
import { apiStats } from "../../../services/Api/Api";
import { User } from "../../../services/Interface/Interface";

function useUserStats(login: string | undefined) {
    const [user, setUser] = useState<User>();

    useEffect(() => {
		const fetchUser = async () => {
			try {
				const url = `http://127.0.0.1/api/users/${login}${apiStats}`;
				const reponse = await axios.get(url);
				setUser(reponse.data);
			} catch (err) {
				// console.log(err);
			}
		}
		fetchUser();
	}, [login])
    return user;
}

export default useUserStats;