import React from "react";
import { io } from "socket.io-client";

const uri = "/chat";
const gameWSUri = '/game';

export const socket = io(uri, {
	withCredentials: true,
});

export const gameSocket = io(gameWSUri, {
	withCredentials: true,
});

export const SocketContext = React.createContext(socket);