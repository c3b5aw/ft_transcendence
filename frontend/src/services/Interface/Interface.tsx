import { ROLE } from "../Api/Role";

export interface User {
	banned: boolean
	connected: boolean
	created: string
	defeats: number
	display_name: string
	elo: number
	email: string
	id: number
	lastLogin: string
	login: string
	played: number
	role: ROLE
	rank: number
	victories: number
}

export interface Match {
	id: number
	date: string
	finished: boolean
	duration: number
	player_1_id: number
	player_1_login: string
	player_1_score: number
	player_2_id: number
	player_2_login: string
	player_2_score: number
}

export interface Achievements {
	achievement_id: number
	achievement_avatar: string
	achievement_description: string
	achievement_name: string
	unlocked_at: string
}

export interface Friends {
	id: number
	user_id: number
	user_login: string
	friend_id: number
	friend_login: string
	status: number
}

export interface ISearchBar {
	handleClickCell: (row: User) => void
}