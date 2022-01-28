import { Avatar, Stack, Typography } from "@mui/material";
import { User } from "../Services/Interface/Interface";

function MyAvatar(props: {user: User}) {
	const { user } = props;
	const event = new Date(user.last_login);
	return (
		<Stack direction={{ xs: 'column', sm: 'column', md: 'column', lg: 'row' }} alignItems="center" justifyContent="center" spacing={3}>
			<Avatar
				sx={{ width: {xs: "64px", sm: "96px", md: "96px", lg: "128px"}, height: {xs: "64px", sm: "96px", md: "96px", lg: "128px"} }}
				src="http://127.0.0.1/api/profile/avatar">
			</Avatar>
			<Stack alignItems="center">
				<Typography variant="h5" style={{fontFamily: "Myriad Pro", textAlign: "center"}}>{user.login} ({user.role})</Typography>
				<Typography variant="h5" style={{color: 'grey'}}>{event?.toDateString()}</Typography>
			</Stack>
		</Stack>
	);
}

export default MyAvatar;