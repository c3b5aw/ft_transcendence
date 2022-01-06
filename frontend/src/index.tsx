import React from 'react';
import ReactDOM from 'react-dom';

function App() {
	return (
		<h1>Hello World - from frontend</h1>
	)
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);