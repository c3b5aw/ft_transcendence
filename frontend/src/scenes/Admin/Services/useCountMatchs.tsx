import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiMatch } from "../../../services/Api/Api";

function useCountMatchs() {
    const [countMatchs, setCountMatchs] = useState<number>();

    useEffect(() => {
		const fetchCountMatchs = async () => {
			try {
				const response = await axios.get(`${api}${apiMatch}/count`);
				setCountMatchs(response.data.total);
			}
			catch (err) {
				// console.log(err);
			}
		}
		fetchCountMatchs();
	}, []);
    return (countMatchs);
}

export default useCountMatchs;