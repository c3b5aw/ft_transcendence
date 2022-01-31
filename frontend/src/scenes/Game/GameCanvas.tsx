import { Paper } from '@mui/material';

export default function GameCanvas() {
	return (
		<Paper>
			<canvas id="game-Canvas" style={{
				width: "100%",
				height: "100%",
			}} />
		</Paper>
	)
}