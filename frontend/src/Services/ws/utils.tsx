import React from "react";
import { io } from "socket.io-client";

const uri = "/chat";

export const socket = io(uri, {
	withCredentials: true,
});

export const SocketContext = React.createContext(socket);