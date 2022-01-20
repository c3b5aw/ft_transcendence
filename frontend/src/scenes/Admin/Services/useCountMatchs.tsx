import axios from "axios";
import { useEffect, useState } from "react";
import { api, apiMatch } from "../../../services/Api/Api";
import { useSnackbar } from 'notistack'

function useCountMatchs() {
    const [countMatchs, setCountMatchs] = useState<number>();
	const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
		const fetchCountMatchs = async () => {
			try {
				const response = await axios.get(`${api}${apiMatch}/count`);
				setCountMatchs(response.data.total);
			}
			catch (err) {
				enqueueSnackbar(`Impossible de récupérer le nombre total de matchs (${err})`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		fetchCountMatchs();
	}, [enqueueSnackbar]);
    return (countMatchs);
}

export default useCountMatchs;