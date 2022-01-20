# RECEIVE / LISTEN

## Snackbar / Events

- onSuccess
```typescript
/* Action success */
{
	message: string
}
```

- onError
```typescript
/* Action failed */
{
	error: string
}
```

## Channel events

- channel::message
```typescript
/* New incoming message */
{
	channel: [2] {
		id: number,
		name: string
	},
	message: {
		user: string,
		content: string,
		announcement: boolean,
		timestamp: Date
	}
}
```

- channel::membersReload
```typescript
/* You must refresh member list */
{
	channel: [2] {
		id: number,
		name: string
	}
}
```

## User Channel events

- channel::onJoin
```typescript
/* You have sucessfully joined a channel */
{
	channel: [2] {
		id: number,
		name: string
	}
}
```

- channel::onKick
```typescript
/* You have been kicked from channel */
{
	channel: [2] {
		id: number,
		name: string
	}
}
```

- channel::onBan
```typescript
/* You have been banned from channel */
{
	channel: [2] {
		id: number,
		name: string
	},
	banned: boolean
}
```

- channel::onRoleUpdate
```typescript
/* Your channel role has been changed */
{
	channel: [2] {
		id: number,
		name: string
	},
	role: UserRole.enum
}
```

- channel:onMute
```typescript
/* You have been channel muted until .. (may be past Date if you have been unmuted) */
{
	channel: [2] {
		id: number,
		name: string
	},
	until: Date
}
```


# SEND / EMIT

- channel::join
```typescript
/* Joined a channel */
{
	channel: string,
	password: string - "" for empty pwd
}
```

- channel::send
```typescript
/* Send a message in channel:name, must be joined */
{
	channel: string,
	message: string
}
```

- channel::leave
```typescript
/* Leave a channel::name, (forever. Until joined again.) */
{
	channel: string
}
```