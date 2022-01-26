import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Connection from '../../scenes/Connection/View/Connection';
import { api, apiMe } from '../Api/Api';
import { ROLE } from '../Api/Role';
import { Status, User } from '../Interface/Interface';
import { useSnackbar } from 'notistack'
import { SocketContext } from '../ws/utils';
import MyFactorAuth from '../../components/MyFactorAuth';

const PrivateRoute = ({ children, roles }: { children: JSX.Element; roles: Array<ROLE>}) => {
	const [me, setMe] = useState<User>();
	const [status, setStatus] = useState<Status>();
	const { enqueueSnackbar } = useSnackbar();
	const socket = useContext(SocketContext);
	const [openQrcode, setOpenQrcode] = useState<boolean>(true);

	useEffect(() => {
		const fetchConnected = async () => {
			const response = await fetch('/api/auth/status');
			if (!response.ok) {
				throw new Error(`Erreur HTTP ! statut : ${response.status}`);
			}
			else {
				const body = await response.json();
				const sta: Status = {
					isAuthenticated: body.isAuthenticated,
					isTwoFaAuthenticated: body.isTwoFaAuthenticated,
				}
				setStatus(sta);
				if (body.isAuthenticated === true) {
					enqueueSnackbar(`${body.user.login} est connecté`, { 
						variant: 'success',
						autoHideDuration: 2000,
					});
					socket.connect();
					console.log(body);
	
					socket.on("onError", (data) => {
						enqueueSnackbar(`${data.error}`, { 
							variant: 'error',
							autoHideDuration: 3000,
						});
					});
	
					socket.on("onSuccess", (data) => {
						enqueueSnackbar(`${data.message}`, { 
							variant: 'success',
							autoHideDuration: 2000,
						});
					});

					socket.on("channel::onJoin", (data) => {
						enqueueSnackbar(`Join ${data.name}`, { 
							variant: 'success',
							autoHideDuration: 2000,
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
	}, [enqueueSnackbar, socket])

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
		if (status !== undefined && status?.isAuthenticated)
			fetchMe();
	}, [enqueueSnackbar, status])

	if (status !== undefined && status.isAuthenticated && me !== undefined && roles.includes(me.role)) {
		if (!status.isTwoFaAuthenticated) {
			return (<MyFactorAuth setOpenQrcode={setOpenQrcode} turnon={false}/>);
		}
		return (children);
	}
	return (<Connection />);
};

export default PrivateRoute;