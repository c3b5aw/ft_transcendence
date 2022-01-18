export enum RequestError {
	USER_NOT_FOUND = 'user not found',
	USER_NOT_IN_CHANNEL = 'user not in channel',
	CHANNEL_NOT_FOUND = 'channel not found',
	CHANNEL_ALREADY_EXIST = 'channel already exist',
	NOT_ENOUGH_PERMISSIONS = 'not enough permissions',
}

export enum WsError {
	CHANNEL_NOT_FOUND = 'channel not found',
	CHANNEL_NOT_JOINED = 'channel not joined',
	CHANNEL_NOT_MODERATOR = 'channel not moderator',
	CHANNEL_NOT_SPECIFIED = 'channel not specified',
	USER_NOT_FOUND = 'user not found',
	UNABLE_TO_JOIN_CHANNEL = 'unable to join channel',
	INVALID_PASSWORD = 'invalid password',
	UNABLE_AUTH_CHANNEL = 'unable to authenticate with channel',
	INVALID_JSON = 'invalid json',
	MESSAGE_NOT_SPECIFIED = 'message not specified',
	USER_NOT_IN_CHANNEL = 'user not in channel',
	USER_BANNED = 'user banned',
	USER_MUTED = 'user muted',
}