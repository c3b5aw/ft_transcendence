export enum MATCHTYPE {
	MATCH_BOT = 'BOT',
	MATCH_NORMAL = 'NORMAL',
	MATCH_RANKED = 'RANKED',
}

export interface Room {
	roomName: string,
	login: string,
}