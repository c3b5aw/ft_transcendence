import { Paper } from '@mui/material';

export default function GameCanvas() {
	return (
		<Paper>
			<canvas id="game-canvas" style={{
				width: "100%",
				height: "100%",
				background: 'black',
			}} />
		</Paper>
	)
}