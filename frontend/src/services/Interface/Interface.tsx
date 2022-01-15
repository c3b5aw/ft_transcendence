export interface User {
	id: number
	login: string
	display_name: string
	email: string
	role: number
	banned: boolean
	elo: number
	played: number
	victories: number
	defeats: number
	connected: boolean
	created: string
	lastLogin: string
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

export interface Message {
	id: number
	description: string
	to: string
}

export interface Friends {
	id: number
	user_id: number
	user_login: string
	friend_id: number
	friend_login: string
	status: number
}