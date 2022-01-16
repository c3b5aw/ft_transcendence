import { Avatar, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { rolesArray } from "../services/Api/Api";

function MyAvatar(props: {login: string | undefined, role: number | undefined}) {
	const { login } = props;
	const { role } = props;
	const [event, setEvent] = useState<Date>();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const url = `http://127.0.0.1/api/users/${login}`;
				const reponse = await axios.get(url);
				return reponse;
			} catch (err) {
				console.log(err);
			}
		}
		async function fetchCreated() {
			const result = await fetchUser();
			setEvent(new Date(result?.data.created))
		}
		if (login != undefined) {
			fetchCreated();
		}
	}, [login])

	return (
		<Stack sx={{ width: 1, height: 1/4, marginTop: "30px"}} direction="column" alignItems="center" justifyContent="flex-start" spacing={3}>
            <Avatar
                src={`http://127.0.0.1/api/users/${login}/avatar`}
                sx={{ width: "126px", height: "126px" }}>
            </Avatar>
            <h2>{login} ({role != undefined ? rolesArray[role] : null})</h2>
            <h3 style={{ color: 'grey' }}>{event?.toDateString()}</h3>
        </Stack>
	);
}

export default MyAvatar;