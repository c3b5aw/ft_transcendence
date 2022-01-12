import React from "react";
import { ROLE } from "./services/Api/Api";
import { ContextType, IMe } from "./services/Api/type.d";
import { me } from "./services/Api/Api";

export const MeContext = React.createContext<ContextType | null>(null);

const MeProvider: React.FC<React.ReactNode> = ({ children }) => {
	const [me2, setMe] = React.useState<IMe>(me);

	const updateTodo = () => {
		me2.connected = true;
		setMe(me2);
	};

	const updateLogin = (login: string) => {
		me2.login = login;
		setMe(me2);
	};

	const updateDisplayName = (displayName: string) => {
		me2.display_name = displayName;
		setMe(me2);
	};

	const updateEmail = (email: string) => {
		me2.email = email;
		setMe(me2);
	};

	const updateAvatar = (avatar: string) => {
		me2.avatar = avatar;
		setMe(me2);
	};

	const updateElo = (elo: number) => {
		me2.elo = elo;
		setMe(me2);
	};

	const updatePlayed = (played: number) => {
		me2.played = played;
		setMe(me2);
	};

	const updateVictories = (victories: number) => {
		me2.victories = victories;
		setMe(me2);
	};

	const updateDefeats = (defeats: number) => {
		me2.defeats = defeats;
		setMe(me2);
	};

	const updateConnected = (connected: boolean) => {
		me.connected = connected;
		setMe(me2);
	};

	const updateLastLogin = (lastLogin: Date) => {
		me2.lastLogin = lastLogin;
		setMe(me2);
	};

	const updateRoles = (roles: ROLE) => {
		me2.roles = roles;
		setMe(me2);
	};

	return (
		<MeContext.Provider value={{ user: me,
				updateTodo,
				updateLogin,
				updateDisplayName,
				updateEmail,
				updateAvatar,
				updateElo,
				updatePlayed,
				updateVictories,
				updateDefeats,
				updateConnected,
				updateLastLogin,
				updateRoles
			}}>
			{children}
		</MeContext.Provider>
	);
};

export default MeProvider;
/*
import * as React from "react";
import { ROLE } from "./services/Api/Api";
import { ContextType } from "./services/Api/type.d";
import { UserTest } from "./services/Interface/Interface";

// export const TodoContext = React.createContext<ContextType | null>(null);
export const MeContext = React.createContext<ContextType | null>(null);

const MeProvider: React.FC<React.ReactNode> = ({ children }) => {
	// const [todos, setTodos] = React.useState<ITodo[]>([
	const [me, setMe] = React.useState<UserTest>(
		{
			id: 100,
			login: "sbeaujar",
			display_name: "display_name_sbeaujar",
			email: "sbeaujar@42.fr",
			avatar: "",
			elo: 123,
			played: 12,
			victories: 13,
			defeats: 2,
			connected: false,
			roles: ROLE.User,
		}
	);

	const updateTodo = () => {
		me.connected = true;
		setMe(me);
	};

	return (
		<MeContext.Provider value={{ me, updateTodo }}>
			{children}
		</MeContext.Provider>
	);
};

export default MeProvider;
*/