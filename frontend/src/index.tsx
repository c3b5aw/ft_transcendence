import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import MyMissing from './components/MyMissing';

import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import { usersApi } from './utils/Api';
import { UserProps } from './utils/Interface';
import "./pages/App.css";

const useStyles = makeStyles({
	theme: {
		backgroundColor: "#1d3033",
		minHeight: 1,
		minWidth: 1,
		color: "white",
	},
});

function ManageRouter() {
	const classes = useStyles();
	const [users, setUsers] = useState<UserProps[]>([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const reponse = await axios.get(`${usersApi}`);
				setUsers(reponse.data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchUsers();
	}, [])

	return (
		<div className={classes.theme}>
			<Router>
				<Routes>
					<Route path='*' element={MyMissing(users)} />
					<Route path='/' element={ <HomePage /> }/>
					{/* <Route path='/settings' element={ <Settings /> }/> */}
					{/* <Route path='/stats' element={ <StatsPage /> }/> */}
					{/* <Route path='/classement' element={ <Classement /> }/> */}

					<Route path='/api/users/:login'element={ <StatsPage items={users}/> }/>
				</Routes>
			</Router>
		</div>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<ManageRouter/>
	</React.StrictMode>,
	document.getElementById('root')
);