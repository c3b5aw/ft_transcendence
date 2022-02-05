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

- channel::onMessage
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

- channel::onMembersReload
```typescript
/* You must refresh member list */
{
	channel: [2] {
		id: number,
		name: string
	}
}
```

- channel::onListReload
```typescript
/* You must refresh channel list */
{
	channel: [2] {
		id: number,
		name: string
	}
}
```

- channel::onCreate
```typescript
/* You have sucessfully created a channel */
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

## MatchMaking events

- matchmaking::onMatch
```typescript
/* Match has been found */

{
    match: {
        hash: string,
        player1: number,
        player2: number,
        date: string,
        type: MatchType.enum,
        finished: boolean,
        id: number,
        duration: number,
        player1_score: number,
        player2_score: number
    }
}
```

- matchmaking::onLeave
```typescript
/* Left MM queue */
{
	message: string
}
```

- matchmaking::onJoin
```typescript
/* Joined MM queue */
{
	room: string,
	match_type: MatchType.enum
}
```

# SEND / EMIT

## Channel events

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

## MatchMaking events

- matchmaking::join
```typescript
/* Join matchmaking */
{
	match_type: MatchType.enum
	room: string // [ optional, if match is a normal game ] , this is the room name
}
```

- matchmaking::leave
```typescript
/* Leave matchmaking, (if in queue) */

// - No payload
```