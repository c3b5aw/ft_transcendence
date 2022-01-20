import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import { io } from "socket.io-client";

function Home() {

	const [ logged, setLogged ] = useState(false);
	const [ login, setLogin ] = useState("");

	const uri = "http://127.0.0.1/chat";

	const socket = io(uri, {
		withCredentials: true,
	});

	useEffect(() => {
		(async () => {
			const response = await fetch('/api/auth/status');
			const body = await response.json();
			console.log(body);

			if (body.isAuthenticated === true) {
				console.log("logged in");

				setLogged(true);
				setLogin(body.user.login);

				socket.connect();

				socket.on("onError", (data) => {
					console.log(data);
				});

				socket.on("onSuccess", (data) => {
					console.log(data);
				});

				socket.on("channel::message", (data) => {
					console.log(data);
				});
			}
		})();
	});

	const sendMsg = () => {
		const msg = JSON.stringify({
			channel: "public",
			message: "test message",
		})
		console.log(msg);
		socket.emit("channel::send", msg);
	}

	const connect = () => {
		socket.emit("channel::join", JSON.stringify({
			channel: "public",
			password: "",
		}));
	}

	return (
		<div>
			<h1>Home</h1>
			{
				logged ? (
					<div>
						<p>Logged as { login }</p>

						<button>
							<a href="/api/auth/logout">
								Logout
							</a>
						</button>

						<div>
							<h1> Socket.io testing </h1>
							<button onClick={() => connect() }>Connect</button>
							<button onClick={() => sendMsg() }>Send msg</button>
						</div>

					</div>
				) : (
					<button>
						<a href="/api/auth/login">Status</a>
					</button>
				)
			}
		
		</div>
	)
}

function App() {
	return (
		<div>
			<Router>
				<Routes>
					<Route path='/' element={<Home />} />
				</Routes>
			</Router>
		</div>
	)
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);