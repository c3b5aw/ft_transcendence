import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class MatchsService {
	constructor(private readonly usersService: UsersService) {}

	// async getMatchById(userId: number) {
	// }
// 
	// async getMatchs() {
// 
	// }
}
