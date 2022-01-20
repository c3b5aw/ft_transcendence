import { makeStyles } from '@material-ui/core/styles';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import { pageAdmin, pageChat, pageClassement, pageHome, pageSettings, pageStats } from './Services/Routes/RoutePage';
import "./scenes/App.css";
import PrivateRoute from './Services/Routes/PrivateRoute';
import Stats from './scenes/Stats/View/Stats';
// import MeProvider from './MeProvider';
import MyMissing from './components/MyMissing';
import Home from './scenes/Home/View/Home';
import Settings from './scenes/Settings/View/Settings';
import Classement from './scenes/Ladder/View/Classement';
import React from 'react';
import Chat from './scenes/Chat/View/Chat';
import Admin from './scenes/Admin/View/Admin';
import { ROLE } from './Services/Api/Role';
import { SnackbarProvider } from 'notistack';

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
	return (
		<div className={classes.theme}>
			<Router>
				<Routes>
					<Route path='*' element={ <MyMissing />} />
					<Route
						path={pageHome}
						element={
							<PrivateRoute roles={[ROLE.MEMBER, ROLE.MODERATOR, ROLE.ADMIN]}>
								<Home />
							</PrivateRoute>
						}
					/>
					<Route
						path={pageSettings}
						element={
							<PrivateRoute roles={[ROLE.MEMBER, ROLE.MODERATOR, ROLE.ADMIN]}>
								<Settings />
							</PrivateRoute>
						}
					/>
					<Route
						path={pageClassement}
						element={
							<PrivateRoute roles={[ROLE.MEMBER, ROLE.MODERATOR, ROLE.ADMIN]}>
								<Classement />
							</PrivateRoute>
						}
					/>
					<Route
						path={pageStats}
						element={
							<PrivateRoute roles={[ROLE.MEMBER, ROLE.MODERATOR, ROLE.ADMIN]}>
								<Stats />
							</PrivateRoute>
						}
					/>
					<Route
						path={pageChat}
						element={
							<PrivateRoute roles={[ROLE.MEMBER, ROLE.MODERATOR, ROLE.ADMIN]}>
								<Chat />
							</PrivateRoute>
						}
					/>
					<Route
						path={pageAdmin}
						element={
							<PrivateRoute roles={[ROLE.MEMBER, ROLE.MODERATOR, ROLE.ADMIN]}>
								<Admin />
							</PrivateRoute>
						}
					/>
				</Routes>
			</Router>
		</div>
	);
}

ReactDOM.render(
	<SnackbarProvider maxSnack={3}>
		<React.StrictMode>
			<ManageRouter/>
		</React.StrictMode>
	</SnackbarProvider>,
	document.getElementById('root')
);
