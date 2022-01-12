import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '../components/MyButton';
import { StyleH1 } from '../styles/Styles';

function Connection()
{
	const styleH1 = StyleH1();

	return (
		<Stack>
			<Box sx={{
				height: 500,
				width: 1,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
			>
			<h1 className={styleH1.root}>ft_transcendance</h1>
			</Box>
			<Box sx={{
				height: 300,
				width: 1,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
			>
			<Button 
				border="none"
				borderRadius={20}
				color="white"
				height = "100px"
				onClick={() => {
					window.location.href = "http://localhost/api/auth/login";
				}}
				width = "350px"
				children = "OAuth 42"
			/>
			</Box>
			<Box sx={{
				height: 500,
				width: 1,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}>
				<Stack direction="row" spacing={3}>
					<Avatar sx={{ width: 64, height: 64, bgcolor: "green" }}>EO</Avatar>
					<Avatar sx={{ width: 64, height: 64, bgcolor: "green" }}>SB</Avatar>
					<Avatar sx={{ width: 64, height: 64, bgcolor: "green" }}>NB</Avatar>
					<Avatar sx={{ width: 64, height: 64, bgcolor: "green" }}>EB</Avatar>
				</Stack>
			</Box>
		</Stack>
	);
}

export default Connection;