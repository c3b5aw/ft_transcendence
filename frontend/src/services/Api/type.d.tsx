export interface IMe {
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
  
export type ContextType = {
	user: IMe;
	updateTodo: (connected: boolean) => void;
	updateLogin: (login: string) => void;
	updateDisplayName: (displayname: string) => void;
	updateEmail: (email: string) => void;
	updateElo: (elo: number) => void;
	updatePlayed: (played: number) => void;
	updateVictories: (victories: number) => void;
	updateDefeats: (defeats: number) => void;
	updateConnected: (connected: boolean) => void;
	updateLastLogin: (lastLogin: string) => void;
	updateRoles: (role: number) => void;
};