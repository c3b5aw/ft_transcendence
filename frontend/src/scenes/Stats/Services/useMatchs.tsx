import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiMatch, apiUsers } from "../../../services/Api/Api";
import { Match, User } from "../../../services/Interface/Interface";

function useMatchs(user: User) {
    const [matchs, setMatchs] = useState<Match[]>();

    useEffect(() => {
		const fetchMatchs = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}/${user.login}${apiMatch}`);
				setMatchs(response.data);
			}
			catch (err) {
				// console.log(err);
			}
		}
		fetchMatchs();
	}, []);
    return matchs;
}

export default useMatchs;