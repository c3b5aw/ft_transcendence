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
export const apiChat = "/chat"
export const apiChannels = "/channels"

/*
** Route Page
*/
export const pageHome = "/"
export const pageSettings = "/settings"
export const pageStats = "/stats/:login"
export const pageChat = "/chat"
export const pageAdmin = "/admin"
export const pageClassement = "/classement"
export const pageLogin = "/login"
export const apiGame = "/game";

export enum ROLE {
	MEMBER = 1,
	MODERATOR = 2,
	ADMIN = 3,
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
