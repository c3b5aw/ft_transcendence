import { socketMatchmaking } from "../../../Services/ws/utils"
import { MATCHTYPE } from "./utils"

export const matchJoinRanked = (match_type: MATCHTYPE) => {
	socketMatchmaking.emit('matchmaking::join', JSON.stringify({
		match_type: match_type,
	}));
}

export const matchJoinNormal = (match_type: MATCHTYPE, nameRoom: string) => {
	socketMatchmaking.emit('matchmaking::join', JSON.stringify({
		match_type: match_type,
		room: nameRoom,
	}));
}

export const matchJoinDuel = (match_type: MATCHTYPE, login: string) => {
	socketMatchmaking.emit('matchmaking::join', JSON.stringify({
		match_type: match_type,
		duel_login: login,
	}));
}

export const matchLeave = () => {
	socketMatchmaking.emit('matchmaking::leave');
}