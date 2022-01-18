import { Avatar, Stack } from "@mui/material";
import { User } from "../services/Interface/Interface";

function MyAvatar(props: {user: User}) {
	const { user } = props;

	const event = new Date(user.created);
	return (
		<Stack sx={{ width: 1, height: 1/4, marginTop: "30px"}} direction="column" alignItems="center" justifyContent="flex-start" spacing={3}>
            <Avatar
                src={`http://127.0.0.1/api/users/${user.login}/avatar`}
                sx={{ width: "126px", height: "126px" }}>
            </Avatar>
            <h2>{user.login} ({user.role})</h2>
            <h3 style={{ color: 'grey' }}>{event?.toDateString()}</h3>
        </Stack>
	);
}

export default MyAvatar;