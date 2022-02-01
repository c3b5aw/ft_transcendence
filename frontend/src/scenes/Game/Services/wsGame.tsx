import { socketMatchmaking } from "../../../Services/ws/utils"
import { MATCHTYPE } from "./utils"

export const matchJoin = (match_type: MATCHTYPE) => {
	socketMatchmaking.emit('matchmaking::join', JSON.stringify({
		match_type: match_type,
		room: "test_test"
	}));
}

export const matchLeave = () => {
	socketMatchmaking.emit('matchmaking::leave');
}