import { useEffect, useState } from 'react';
import Connection from '../../scenes/Connection';
import { ROLE } from '../Api/Api';

const PrivateRoute = ({ children, roles }: { children: JSX.Element; roles: Array<ROLE>}) => {
	const [logged, setLogged] = useState(false);
	// const [rolesUser, setRoles] = useState<Array<ROLE>>([]);
	
	useEffect(() => {
		const fetchConnected = async () => {
			const response = await fetch('/api/auth/status');
			const body = await response.json();

			if (body.isAuthenticated) {
				setLogged(body.isAuthenticated);
				// setRoles(body.user.roles);
			}
		}
		fetchConnected();
	}, [])
	if (logged && roles.includes(ROLE.Admin))
		return (children)
	else
		return (<Connection />);
};

export default PrivateRoute;