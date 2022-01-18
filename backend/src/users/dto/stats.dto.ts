import { UserRole } from '../entities/roles.enum';

export class UserStats {
	id: number;
	login: string;
	role: UserRole;
	rank: number;
	elo: number;
	played: number;
	victories: number;
	defeats: number;
	created: Date;
}