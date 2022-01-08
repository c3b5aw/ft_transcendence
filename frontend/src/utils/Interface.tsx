export interface UserProps {
    id: number
    login: string
    avatar_url: string
    following_url: string
    subscriptions_url: string
}

export interface MatchProps {
    id: number
    played: number
    victories: number
    defeats: number
    history_url: string
}

export interface MatchPropsTmp {
    id: number
    login: string
    avatar_url: string
}

export interface UserListProps {
    items: UserProps[]
};

export interface MatchListProps {
    items: MatchProps[]
}

export interface MessageProps {
    message: string
    to: string
}