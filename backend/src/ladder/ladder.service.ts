import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';

import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LadderService {

	constructor(private readonly usersService: UsersService) {}

	async getLadder() : Promise<User[]> {
		return this.usersService.getLadder();
	}
}