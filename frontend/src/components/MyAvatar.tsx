import { Avatar, Stack, Typography } from "@mui/material";
import { User } from "../Services/Interface/Interface";

function MyAvatar(props: {user: User}) {
	const { user } = props;
	const event = new Date(user.last_login);
	return (
		<Stack 
			direction={{ xs: 'column', sm: 'column', md: 'column', lg: 'row' }}
			alignItems="center"
			justifyContent="center"
			spacing={3}
		>
			<Avatar
				sx={{ width: {xs: "96px", sm: "96px", md: "138px", lg: "128px"}, height: {xs: "96px", sm: "96px", md: "128px", lg: "128px"} }}
				src={`/api/users/${user.login}/avatar`}>
			</Avatar>
			<Stack alignItems="center">
				<Typography 
					variant="h4"
					style={{fontFamily: "Myriad Pro", textAlign: "center"}}
				>
					{user.login} ({user.role})
				</Typography>
				<Typography
					variant="h5"
					style={{color: 'grey'}}
				>
					{event?.toDateString()}
				</Typography>
				<Typography
					variant="h5"
					style={{color: 'grey'}}
				>
					{user.display_name}
				</Typography>
			</Stack>
		</Stack>
	);
}

export default MyAvatar;