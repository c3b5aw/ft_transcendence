import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	async validateUser(details: User) : Promise<User> {
		const user: User = await this.usersService.findOneByLogin(details.login);
		if (!user) {
			const newUser = await this.usersService.createUser(details);
			return this.usersService.createUser(details);
		}
		return user;
	}

	async findUser(login: string) : Promise<any> {
		const user = this.usersService.findOneByLogin(login);
		if (!user)
			throw new UnauthorizedException();
		return user;
	}
}