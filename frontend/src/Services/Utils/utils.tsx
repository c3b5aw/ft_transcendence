import { ROLE } from "../Api/Role";
import { Match, User } from "../Interface/Interface";

export const deleteBannedUserList = (users: User[]) => {
	return (users.filter(user => user.role !== ROLE.BANNED))
}

export const usersBanned = (users: User[]) => {
	return (users.filter(user => user.role === ROLE.BANNED))
}

export const loginInUsers = (login1: string, login2: string, usersBan: User[]) => {
	var res: boolean = true;
	usersBan.forEach(function(item, index, array) {
		if (item.login === login1 || item.login === login2)
			res = false;
	});
	return (res);
}

export const deleteMatchUserBanned = (matchs: Match[], users: User[]) => {
	const usersBan = usersBanned(users);
	return (matchs.filter(match => loginInUsers(match.player1_login, match.player2_login, usersBan)))
}