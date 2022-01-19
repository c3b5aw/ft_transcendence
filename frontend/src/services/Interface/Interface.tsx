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
	player1: number
	player1_login: string
	player1_score: number
	player2: number
	player2_login: string
	player2_score: number
}

export interface Achievements {
	achievement_id: number
	achievement_avatar: string
	achievement_description: string
	achievement_name: string
	unlocked_at: string
}

export interface Friends {
	id: number,
	connected: boolean,
	login: string,
	status: string,
}

export interface ISearchBar {
	handleClickCell: (row: User) => void
}

export enum STATUS {
	PENDING = "PENDING",
	ACCEPTED = "ACCEPTED",
	BLOCKED = "BLOCKED",
}