import React from "react";
import { io } from "socket.io-client";

const uri = "/chat";
const uriMatchmaking = "/matchmaking";

export const socket = io(uri, {
	withCredentials: true,
});

export const socketMatchmaking = io(uriMatchmaking, {
	withCredentials: true,
});

export const SocketContext = React.createContext(socket);