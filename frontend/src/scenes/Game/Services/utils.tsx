import { User } from "../../../Services/Interface/Interface";

export enum MATCHTYPE {
	MATCH_BOT = 'BOT',
	MATCH_NORMAL = 'NORMAL',
	MATCH_RANKED = 'RANKED',
	MATCH_DUEL = 'DUEL',
}

export interface Room {
	name: string;
}

export interface RoomV {
	owner: User;
	room: Room;
}