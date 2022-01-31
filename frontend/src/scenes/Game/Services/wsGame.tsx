import { socket } from "../../../Services/ws/utils"
import { MATCHTYPE } from "./utils"

export const matchOnJoin = (match_type: MATCHTYPE) => {
    socket.emit('matchmaking::join')
}