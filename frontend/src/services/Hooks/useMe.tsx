import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiMe } from "../Api/Api";
import { User } from "../Interface/Interface";

function useMe() {
	const [me, setMe] = useState<User>();

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchMe();
	}, [])
	return (me);
}

export default useMe;