import axios from 'axios';
import { useEffect, useState } from 'react';
import Connection from '../../scenes/Connection/View/Connection';
import { api, apiMe } from '../Api/Api';
import { ROLE } from '../Api/Role';
import { User } from '../Interface/Interface';
import { useSnackbar } from 'notistack'
import { socket } from '../ws/utils';

const PrivateRoute = ({ children, roles }: { children: JSX.Element; roles: Array<ROLE>}) => {
	const [logged, setLogged] = useState<boolean>(false);
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
				if (body.isAuthenticated === true) {
					enqueueSnackbar(`${body.user.login} est connecté`, { 
						variant: 'success',
						autoHideDuration: 3000,
					});
					setLogged(true);	
					socket.connect();
	
					socket.on("onError", (data) => {
						enqueueSnackbar(`${data.error}`, { 
							variant: 'error',
							autoHideDuration: 3000,
						});
					});
	
					socket.on("onSuccess", (data) => {
						enqueueSnackbar(`${data.message}`, { 
							variant: 'success',
							autoHideDuration: 3000,
						});
					});

					socket.on("channel::onJoin", (data) => {
						enqueueSnackbar(`Join ${data.name}`, { 
							variant: 'success',
							autoHideDuration: 3000,
						});
					});

					socket.on("channel::onReload", async (data) => {
						enqueueSnackbar(`Join ${data.name}`, { 
							variant: 'success',
							autoHideDuration: 3000,
						});
					});
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