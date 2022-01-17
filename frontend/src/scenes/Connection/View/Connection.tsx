import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '../Components/MyButton';
import { StyleH1 } from '../../../styles/Styles';
import { apiConnection } from '../../../services/Api/Api';

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
					window.location.href = `${apiConnection}`
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
					<Avatar
						src="./avatars/77460.jpg"
						sx={{ width: 64, height: 64, bgcolor: "green" }}/>
					<Avatar
						src="./avatars/73316.jpg"
						sx={{ width: 64, height: 64, bgcolor: "green" }}/>
					<Avatar
						src="./avatars/77558.jpg"
						sx={{ width: 64, height: 64, bgcolor: "green" }}/>
					<Avatar
						src="./avatars/83781.jpg"
						sx={{ width: 64, height: 64, bgcolor: "green" }}/>
				</Stack>
			</Box>
		</Stack>
	);
}

export default Connection;