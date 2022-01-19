import axios from 'axios';
import { useEffect, useState } from 'react';
import Connection from '../../scenes/Connection/View/Connection';
import { api, apiMe } from '../Api/Api';
import { ROLE } from '../Api/Role';
import { User } from '../Interface/Interface';

const PrivateRoute = ({ children, roles }: { children: JSX.Element; roles: Array<ROLE>}) => {
	const [logged, setLogged] = useState(false);
	const [me, setMe] = useState<User>();
	// const [rolesUser, setRoles] = useState<Array<ROLE>>([]);

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
			console.log('Il y a eu un problème : ' + e.message);
		});
	}, [])

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const reponse = await axios.get(`${api}${apiMe}`);
				setMe(reponse.data);
			} catch (err) {
				console.log(err);
			}
		}
		if (logged)
			fetchMe();
	}, [logged])

	if (logged && me !== undefined && roles.includes(me.role))
		return (children)
	else
		return (<Connection />);
};

export default PrivateRoute;