import axios from 'axios';
import { useEffect, useState } from 'react';
import Connection from '../../scenes/Connection/View/Connection';
import { api, apiMe } from '../Api/Api';
import { ROLE } from '../Api/Role';
import { User } from '../Interface/Interface';
import { useSnackbar } from 'notistack'

const PrivateRoute = ({ children, roles }: { children: JSX.Element; roles: Array<ROLE>}) => {
	const [logged, setLogged] = useState(false);
	const [me, setMe] = useState<User>();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const fetchConnected = async () => {
			const response = await fetch('/api/auth/status');
			if (!response.ok) {
				throw new Error(`Erreur HTTP ! statut : ${response.status}`);
			}
			else {
				const body = await response.json();
				if (body.isAuthenticated) {
					setLogged(body.isAuthenticated);
				}
			}		
		}
		fetchConnected()
		.catch(e => {
			enqueueSnackbar(`${e}`, { 
				variant: 'error',
				autoHideDuration: 3000,
			});
		});
	}, [enqueueSnackbar])

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
			} catch (err) {
				enqueueSnackbar(`${err}`, { 
					variant: 'error',
					autoHideDuration: 3000,
				});
			}
		}
		if (logged)
			fetchMe();
	}, [enqueueSnackbar, logged])

	if (logged && me !== undefined && roles.includes(me.role))
		return (children)
	else
		return (<Connection />);
};

export default PrivateRoute;