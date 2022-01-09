//http://localhost:3000/api/users/:login
export interface UserProps {
	id: number
	login: string
	avatar_url: string
	following_url: string
	subscriptions_url: string
}

export interface UserListProps {
	items: UserProps[]
};



//http://localhost:3000/api/users/:login/matchs/
export interface MatchsProps {
	id: number
	played: number
	victories: number
	defeats: number
	history: MatchProps[]
}

export interface MatchsPropsTest {
	id: number
	login: string
	avatar_url: string
}

export interface MatchProps {
	id: number
	login_adversaire_one: string
	login_adversaire_two: string
	avatar_url_one: string
	avatar_url_two: string
	score_one: number
	score_two: number
}



//http://localhost:3000/api/users/:login/achievements
export interface AchievementsPropsTmp {
	id: number
	login: string
	avatar_url: string
}

export interface AchievementsProps {
    id: number
    avatar_url: string
    description: string
}



//http://localhost:3000/api/users/:login/messages/:to
export interface MessageProps {
	message: string
	to: string
}