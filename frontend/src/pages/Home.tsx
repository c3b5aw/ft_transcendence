import ConnectionPage from './ConnectionPage';
import "./App.css";
import HomePage from './HomePage';

const Home = () => {
	return (
		<div>
			{/* <ConnectionPage /> */}
			<HomePage />
		</div>
	);
};

export default Home;

/*
interface MessageProps {
	message: string;
	important: boolean;
};

with children
interface MessageProps {
	message: string;
	important: boolean;
	children: JSX.Element | JSX.Element[]
};

function Welcome({ message, important, children}: MessageProps) {
	return (
		<div>
			<h1>{important ? "Important message" : "Regular message"} {message}</h1>
			{children}
		</div>
	);
}

<Welcome message="Bonjour tout le monde" important={true} />

with children
<Welcome message="Bonjour tout le monde" important={true}>
	<h1>Hello Hello Hello</h1>
</Welcome>
*/