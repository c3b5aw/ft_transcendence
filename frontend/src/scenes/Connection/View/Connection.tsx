import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '../Components/MyButton';
import { apiConnection } from '../../../Services/Api/Api';
import { sxAvatar, sxBox } from '../Services/style';
import { Typography } from '@mui/material';

function Connection()
{
	return (
		<Stack>
			<Box sx={sxBox}>
				<Typography variant="h1" style={{textAlign: "center", fontFamily: "Myriad Pro"}}>ft_transcendence</Typography>
			</Box>
			<Box sx={sxBox}>
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
			<Box sx={sxBox}>
				<Stack direction="row" spacing={3}>
					<Avatar
						src="./avatars/77460.jpg"
						sx={sxAvatar}/>
					<Avatar
						src="./avatars/73316.jpg"
						sx={sxAvatar}/>
					<Avatar
						src="./avatars/77558.jpg"
						sx={sxAvatar}/>
					<Avatar
						src="./avatars/83781.jpg"
						sx={sxAvatar}/>
				</Stack>
			</Box>
		</Stack>
	);
}

export default Connection;