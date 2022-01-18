import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiAchievements, apiUsers } from "../../../services/Api/Api";
import { Achievements, User } from "../../../services/Interface/Interface";

function useAchievements(user: User) {
	const [achievements, setAchievements] = useState<Achievements[]>([]);
	useEffect(() => {
		const fetchAchievements = async () => {
			try {
				const response = await axios.get(`${api}${apiUsers}/${user.login}${apiAchievements}`);
				setAchievements(response.data);
			}
			catch (err) {
				// console.log(err);
			}
		}
		fetchAchievements();
	}, [user.login]);
	return (achievements);
}

export default useAchievements;