import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}

	async validateUser(userDetails: UserInterface) : Promise<User> {
		const user: User = await this.usersService.findOneByID(userDetails.id);
		if (!user) {
			return this.usersService.createUser(userDetails);
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