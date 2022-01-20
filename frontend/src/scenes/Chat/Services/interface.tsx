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
    private: boolean,
    tunnel: boolean,
}