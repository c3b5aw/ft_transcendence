import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import ConnectionPage from './pages/ConnectionPage';
import Home from './pages/Home';

function Survey() {
	return (
		<div>
			<h1>Survey :abaque: aaaa</h1>
		</div>
	)
}
function HomeConnection() {
	return (
		<div>
			<h1>Home :abaque:</h1>
		</div>
	)
}
function TestReturn() {

	return (
		<Router>
			<Routes>
				<Route path='/' element={ <HomeConnection /> }/>
				<Route path='/connection' element={ <Home /> }/>
			</Routes>
		</Router>
	);
}
ReactDOM.render(
	<React.StrictMode>
		<TestReturn/>
	</React.StrictMode>,
	document.getElementById('root')
);