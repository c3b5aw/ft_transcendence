import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import { pageAdmin, pageChat, pageClassement,
		pageGame, pageGameHash,
		pageHome, pageMatchmaking, pageRoomView, pageSettings, pageStats } from './Services/Routes/RoutePage';
import "./scenes/App.css";
import PrivateRoute from './Services/Routes/PrivateRoute';
import Stats from './scenes/Stats/View/Stats';
import MyMissing from './components/MyMissing';
import Home from './scenes/Home/View/Home';
import Settings from './scenes/Settings/View/Settings';
import Classement from './scenes/Ladder/View/Classement';
import React from 'react';
import Chat from './scenes/Chat/View/Chat';
import Admin from './scenes/Admin/View/Admin';
import { ROLE } from './Services/Api/Role';
import { SnackbarProvider } from 'notistack';
import { socket, SocketContext } from './Services/ws/utils';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';

import MenuGame from './scenes/Game/Components/MenuGame';
import GameBoard from './scenes/Game/GameBoard';

import RoomsView from './scenes/Game/Components/RoomsView';
import { makeStyles } from '@mui/styles';
import MatchMaking from './scenes/Game/Components/MatchMaking';

const useStyles = makeStyles({
	theme: {
		backgroundColor: "#1d3033",
		minHeight: "100vh",
		color: "white",
	},
});

let theme = createTheme();
theme = responsiveFontSizes(theme);

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
							<PrivateRoute roles={[ROLE.MODERATOR, ROLE.ADMIN]}>
								<Admin />
							</PrivateRoute>
						}
					/>
					<Route
						path={pageGame}
						element={
							<PrivateRoute roles={[ROLE.MEMBER, ROLE.MODERATOR, ROLE.ADMIN]}>
								<MenuGame />
							</PrivateRoute>
						}
					/>
					<Route
						path={pageGameHash}
						element={
							<PrivateRoute roles={[ROLE.MEMBER, ROLE.MODERATOR, ROLE.ADMIN]}>
								<GameBoard />
							</PrivateRoute>
						}
					/>
					<Route
						path={pageRoomView}
						element={
							<PrivateRoute roles={[ROLE.MEMBER, ROLE.MODERATOR, ROLE.ADMIN]}>
								<RoomsView />
							</PrivateRoute>
						}
					/>
					<Route
						path={pageMatchmaking}
						element={
							<PrivateRoute roles={[ROLE.MEMBER, ROLE.MODERATOR, ROLE.ADMIN]}>
								<MatchMaking />
							</PrivateRoute>
						}
					/>
				</Routes>
			</Router>
		</div>
	);
}

ReactDOM.render(
	<SocketContext.Provider value={socket}>
		<SnackbarProvider maxSnack={3}>
			<React.StrictMode>
				<ThemeProvider theme={theme}>
					<ManageRouter/>
				</ThemeProvider>
			</React.StrictMode>
		</SnackbarProvider>
	</SocketContext.Provider>,
	document.getElementById('root')
);
