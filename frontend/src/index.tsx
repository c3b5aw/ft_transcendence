import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'

// import Home from './pages/Home';
// import ConnectionPage from './pages/ConnectionPage';

function Survey() {
    return (
        <div>
            <h1>Survey 🧮</h1>
        </div>
    )
}

function HomeConnection() {
    return (
        <div>
            <h1>Home 🧮</h1>
        </div>
    )
}

function TestReturn() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomeConnection />}/>
				<Route path="/connection" element={<Survey />}/>
			</Routes>
		</Router>	
	);
}

ReactDOM.render(
    <React.StrictMode>
      {TestReturn()}
    </React.StrictMode>,
    document.getElementById('root')
);

// ReactDOM.render(
//   <React.StrictMode>
//     {/* <Router> */}
//         <Home />
//     {/* </Router> */}
//   </React.StrictMode>,
//   document.getElementById('root')
// );