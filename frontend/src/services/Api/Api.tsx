/*
** API
*/
export const api = "/api"
export const apiMe = "/profile"
export const apiUsers = `/users`
export const apiLadder = "/ladder"
export const apiMatch = "/matchs"
export const apiFriends = "/friends"
export const apiMessages = "/messages"
export const apiAchievements = "/achievements"
export const apiConnection = "http://localhost/api/auth/login"

/*
** Route Page
*/
export const pageHome = "/"
export const pageSettings = "/settings"
export const pageStats = "/api/users/:login"
export const pageClassement = "/classement"
export const pageLogin = "/login"
export const apiGame = "/game";

export enum ROLE {
	Admin = 'Admin',
	Moderator = 'Moderator',
	User = 'User',
}

// export const me: User = {
//     id: 100,
// 	login: "sbeaujar",
// 	display_name: "display_name_sbeaujar",
// 	email: "sbeaujar@42.fr",
// 	elo: 123,
// 	played: 12,
// 	victories: 13,
// 	defeats: 2,
// 	connected: false,
// 	role: 1,
// }

// export const MeContext = React.createContext({ me });
