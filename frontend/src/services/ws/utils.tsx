import { io } from "socket.io-client";

const uri = "http://127.0.0.1/chat";

export const socket = io(uri, {
	withCredentials: true,
});