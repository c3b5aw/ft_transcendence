import { socket } from "../../../Services/ws/utils";
import { Channel } from "./interface";

export const channelJoin = (nameChannel: string, passwordChannel: string) => {
	console.log(`[${passwordChannel}]`)
	socket.emit("channel::join", JSON.stringify({
		channel: nameChannel,
		password: passwordChannel
	}));
}

export const channelLeave = (channel: Channel) => {
	socket.emit("channel::leave", JSON.stringify({
		channel: `${channel.name}`,
	}));
}

export const channelSend = (name: string, message: string) => {
	socket.emit("channel::send", JSON.stringify({
		channel: `${name}`,
		message: `${message}`,
	}));
}