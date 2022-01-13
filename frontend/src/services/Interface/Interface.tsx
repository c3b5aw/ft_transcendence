import { ROLE } from "../Api/Api";

export interface User {
	id: number
	login: string
	display_name: string
	email: string
	avatar: string
	elo: number
	played: number
	victories: number
	defeats: number
	connected: boolean
	created?: Date
	lastLogin?: Date
	roles: ROLE
}

export interface Match {
	id: number
	createdAt: Date
	scoreOne: number
	scoreTwo: number
	loginAdversaireOne: string
	loginAdversaireTwo: string
	avatarUrlOne: string
	avatarUrlTwo: string
}

export interface Achievements {
	id: number
	description: string
	avatar: string
}

export interface Message {
	id: number
	description: string
	to: string
}