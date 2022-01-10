import { Injectable } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfileService {
	constructor(private readonly usersService: UsersService) {}

	// async setDisplayName(userId: number, displayName: string) {

	// }

	// async setAvatar(userId: number, avatar: string) {

	// }
}