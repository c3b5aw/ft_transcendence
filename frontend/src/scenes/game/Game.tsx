import { Button, Stack } from "@mui/material";

function Game() {
	return (
		<Stack direction="column" sx={{width: 1, height: "100vh"}}>
			<Ga2me />
		</Stack>
	);
}

function Ga2me() {
	return (<h1>{GGame()}</h1>);
}

const GGame = () : number => {
	return (3)
}

export default Game