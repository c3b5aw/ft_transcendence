import React from 'react';

import { ThemeNestingExtend } from "./interface/ConnectionPage2"
// import { MyForm } from "./MyForm";
// import { MyCheckbox } from "./MyForm";
// import { MyBackground } from "./MyForm";

import ConnectionPage from './interface/ConnectionPage';

import "./App.css";


const App = () => {
	return (
		<div className="App">
			<ConnectionPage />
		</div>
	);
};

export default App;

{/* <MyBackground/> */}
{/* <MyForm onSubmit={() => {}} /> */}
{/* <MyCheckbox /> */}