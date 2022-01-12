import { ROLE } from "./Api";

export interface IMe {
	id: number;
	login: string;
	display_name: string;
	email: string;
	avatar: string;
	elo: number;
	played: number;
	victories: number;
	defeats: number;
	connected: boolean;
	created?: Date;
	lastLogin?: Date;
	roles: ROLE;
}
  
export type ContextType = {
	user: IMe;
	updateTodo: (connected: boolean) => void;
	updateLogin: (login: string) => void;
	updateDisplayName: (displayname: string) => void;
	updateEmail: (email: string) => void;
	updateAvatar: (avatar: string) => void;
	updateElo: (elo: number) => void;
	updatePlayed: (played: number) => void;
	updateVictories: (victories: number) => void;
	updateDefeats: (defeats: number) => void;
	updateConnected: (connected: boolean) => void;
	updateLastLogin: (lastLogin: Date) => void;
	updateRoles: (roles: ROLE) => void;
};