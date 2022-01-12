import React from "react";
import { User } from "../Interface/Interface";

/*
** API
*/
export const apiTest = "https://61dbd44b4593510017affa07.mockapi.io/api";
export const apiUsersTest = "/users";
export const apiFollowingTest = "/following";
export const apiMatchTest = "/matchs";
export const apiAchievementsTest = "/achievements";

export const usersApi = 'https://api.github.com/users'

/*
** API
*/
export const api = "/api"
export const apiMe = "/me"
export const apiUsers = `/users`
export const apiLadder = "/ladder"
export const apiMatch = "/matchs"
export const apiAchievements = "/achievements"
export const apiConnection = "http://localhost/api/auth/login"

/*
** Route Page
*/
export const pageHome = "/"
export const pageSettings = "/settings"
export const pageStats = "/stats"
export const pageClassement = "/classement"
export const pageLogin = "/login"
export const apiGame = "/game";

export enum ROLE {
	Admin = 'Admin',
	Moderator = 'Moderator',
	User = 'User',
}

export const me: User = {
    id: 100,
	login: "sbeaujar",
	display_name: "display_name_sbeaujar",
	email: "sbeaujar@42.fr",
	avatar: "",
	elo: 123,
	played: 12,
	victories: 13,
	defeats: 2,
	connected: false,
	roles: ROLE.User,
}

export const MeContext = React.createContext({ me });
