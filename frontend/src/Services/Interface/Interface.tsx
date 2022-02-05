import { Channel } from "../../scenes/Chat/Services/interface";
import { MATCHTYPE } from "../../scenes/Game/Services/utils";
import { ROLE } from "../Api/Role";

export interface User {
	banned: boolean
	status: USER_STATUS
	created: string
	defeats: number
	display_name: string
	elo: number
	email: string
	id: number
	last_login: string
	login: string
	played: number
	role: ROLE
	rank: number
	victories: number
	muted: string
	two_factor_auth: boolean
}

export interface Match {
	id: number
	date: string
	hash: string
	finished: boolean
	duration: number
	player1: number
	player1_login: string
	player1_score: number
	player2: number
	player2_login: string
	player2_score: number
	type: MATCHTYPE
}

export interface Achievements {
	achievement_id: number
	achievement_avatar: string
	achievement_description: string
	achievement_name: string
	unlocked_at: string
}

export interface Friend {
	id: number,
	connected: boolean,
	login: string,
	status: string,
}

export interface Status {
	isAuthenticated: boolean,
	isTwoFaAuthenticated: boolean,
}

export interface ISearchBar {
	handleClickCell: (row: User) => void
}

export interface ISearchBarChannel {
	handleClickCell: (row: Channel) => void
}

export enum STATUS {
	PENDING = "PENDING",
	ACCEPTED = "ACCEPTED",
	BLOCKED = "BLOCKED",
	BANNED = "BANNED"
}

export enum USER_STATUS {
	OFFLINE = 'OFFLINE',
	ONLINE = 'ONLINE',
	IN_GAME = 'IN_GAME',
}

export enum PAGE {
	HOME = "HOME",
	STATS = "STATISTIQUES",
	CLASSEMENT = "CLASSEMENT",
	PARAMETRES = "PARAMETRES",
	CHAT = "CHAT",
	GAME = "GAME",
	ADMINVIEW = "ADMIN VIEW",
	MISSING = "MISSING",
}