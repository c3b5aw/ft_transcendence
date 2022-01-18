export interface Message {
    id: number,
    user_id: number,
    channel_id: number,
    annoucement: boolean,
    content: string,
    timestamp: string,
    login: string
}

export interface Channel {
	id: number,
	name: string,
    private: boolean,
}