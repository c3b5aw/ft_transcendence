import { makeStyles } from '@material-ui/core/styles';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import { pageAdmin, pageChat, pageClassement, pageHome, pageSettings, pageStats, ROLE } from './services/Api/Api';
import "./scenes/App.css";
import PrivateRoute from './services/Routes/PrivateRoute';
import Stats from './scenes/Stats';
// import MeProvider from './MeProvider';
import MyMissing from './components/MyMissing';
import Home from './scenes/Home';
import Settings from './scenes/Settings';
import Classement from './scenes/Classement';
import React from 'react';
import Chat from './scenes/Chat';
import Admin from './scenes/Admin';

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
		// <MeProvider>
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
								<PrivateRoute roles={[ROLE.ADMIN]}>
									<Admin />
								</PrivateRoute>
							}
						/>
					</Routes>
				</Router>
			</div>
		// </MeProvider>
	);
}

ReactDOM.render(
	<React.StrictMode>
		<ManageRouter/>
	</React.StrictMode>,
	document.getElementById('root')
);
