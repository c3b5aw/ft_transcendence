import { User } from "../../../Services/Interface/Interface";

export interface Message {
    id: number,
    user_id: number,
    channel_id: number,
    announcement: boolean,
    content: string,
    timestamp: string,
    login: string
}

export interface Channel {
	id: number,
	name: string,
    owner_id: number,
    owner_login: string,
    private: boolean,
    tunnel: boolean,
}

export interface IChannel {
	channels: Channel[],
	handleQuitChannel: (channel: Channel) => void,
	updateListChannels: () => void,
}

export interface IListUser {
	users: User[],
	name_list: string,
	isListChannel: boolean,
	name_channel: string,
}

export interface IBanKickMute {
	name_channel: string,
	user: User,
	open: boolean,
	closeModal: (open: boolean) => void,
}

export interface ISettingM {
	channel: Channel,
	open: boolean,
	isAdmin: boolean,
	closeModal: (open: boolean) => void,
	handleQuitChannel: (channel: Channel) => void,
}

export interface ISettingAdmin {
	channel: Channel,
	open: boolean,
	isAdmin: boolean,
	closeModal: (open: boolean) => void,
	updateListChannels: () => void,
}