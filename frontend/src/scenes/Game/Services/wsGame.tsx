import { socketMatchmaking } from "../../../Services/ws/utils"
import { MATCHTYPE } from "./utils"

export const matchOnJoin = (match_type: MATCHTYPE) => {
    socketMatchmaking.emit('matchmaking::join', JSON.stringify({
        match_type: match_type,
    }));
}