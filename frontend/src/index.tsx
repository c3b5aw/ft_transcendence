import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes, Link } from 'react-router-dom';

import Home from './pages/Home';
import HomePage from './pages/HomePage';


function HomeConnection() {
	return (
		<nav>
      	<Link to="/">Accueil</Link>
      	<Link to="/Home">Home</Link>
    </nav>
	);
}

function Error() {
    return (
        <div>
            <h1>Oups 🙈 Cette page n'existe pas</h1>
        </div>
    )
}

const useStyles = makeStyles({
	theme: {
		backgroundColor: "#1d3033",
		minHeight: "100vh",
		color: "white",
	},
});

function ManageRouter() {
	const classes = useStyles();
	return (
		<div className={classes.theme}>
			<Router>
				<Routes>
					<Route path='*' element={<Error />} />
					<Route path='/' element={ <Home /> }/>
					<Route path='/Home' element={ <HomePage /> }/>
					<Route path='/connection' element={ <HomeConnection /> }/>
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