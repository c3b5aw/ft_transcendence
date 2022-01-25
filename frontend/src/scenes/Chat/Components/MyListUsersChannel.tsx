import { Avatar, Badge, Box, List, ListItemButton, Stack } from '@mui/material';
import { User, USER_STATUS } from '../../../Services/Interface/Interface';

function MyListUserChannel(props : { users: User[] }) {
	const { users } = props;

	const handleClick = (user: User) => {
		console.log("CLICK ON FRIEND USER");
	}

	return (
        <Stack direction="column" sx={{width: 1, height: "100vh", boxShadow: 3, borderTopLeftRadius: 11, borderTopRightRadius: 11}}>
			<Box sx={{backgroundColor: "#2E86C1"}}>
				<h3 style={{textAlign: "center"}}>List Friends</h3>
			</Box>
			<List sx={{overflow: "auto"}}>
				{users.map(user => (
					<ListItemButton key={user.id} component="div" onClick={() => handleClick(user)}>
						<Stack sx={{ width: 1, height: 1}} alignItems="center" direction="row" spacing={2}>
							<Badge badgeContent={""} 
								color={user.status === USER_STATUS.ONLINE ? "success" :
								user.status === USER_STATUS.IN_GAME ? "warning" : "error"}>
								<Avatar
									sx={{marginLeft: "10px",
										width: "32px",
										height: "32px",}}
									src={`http://127.0.0.1/api/users/${user.login}/avatar`}>
								</Avatar>
							</Badge>
							<h4 style={{color: "white"}}>{user.login}</h4>
						</Stack>
					</ListItemButton>
				))}
			</List>
		</Stack>
    );
}

export default MyListUserChannel;