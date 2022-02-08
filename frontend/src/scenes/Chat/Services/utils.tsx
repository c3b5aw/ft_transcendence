import { User } from "../../../Services/Interface/Interface";

export const isMute = (user: User) => {
	const date_now = new Date();
	const date_muted_user = new Date(user.muted);
	return (date_muted_user > date_now);
}

export const isMuteSendMessage = (users: User[], me: User, text: string) => {
	if (users.length > 0 && text === "") {
		const user: User[] = users.filter(item => item.login === me.login)
		if (user.length > 0)
			return (isMute(user[0]));
		else
			return (true);
	}
	else if (users.length === 0)
		return (true);
	return (false);
}