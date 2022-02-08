import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { apiConnection } from '../../../Services/Api/Api';
import { sxAvatar } from '../Services/style';
import { Button, Tooltip, Typography } from '@mui/material';

function Connection() {
	return (
		<Stack direction="column"
			justifyContent="space-evenly"
			alignItems="center"
			sx={{height: "100vh", width: 1}}
		>
			<Typography variant="h2" style={{fontFamily: "Myriad Pro"}}>ft_transcendance</Typography>
			<Button sx={{
				background: 'white',
				color: '#000000',
				'&:hover': {
					backgroundColor: '#D5D5D5',
					color: '#000000',
				},
				padding: {xs: 1, sm: 2, md: 3, lg: 4},
				borderRadius: {xs: 4, sm: 6, md: 8},
				border: 4,
			}}
				onClick={() => window.location.href = `${apiConnection}`}>
				<Typography variant="h4" style={{fontFamily: "Myriad Pro"}}>OAuth 42</Typography>
			</Button>
			<Stack direction="row" spacing={5}>
				<Tooltip title="sbeaujar">
					<Avatar
						src="./avatars/83781.jpg"
						sx={sxAvatar}
					/>
				</Tooltip>
				<Tooltip title="eoliveir">
					<Avatar
						src="./avatars/77558.jpg"
						sx={sxAvatar}
					/>
				</Tooltip>
				<Tooltip title="jtrauque">
					<Avatar
						src="./avatars/77460.jpg"
						sx={sxAvatar}
					/>
				</Tooltip>
			</Stack>
		</Stack>
	);
}

export default Connection;