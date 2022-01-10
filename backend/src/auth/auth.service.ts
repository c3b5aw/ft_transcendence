import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/entities/user.entity';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService,
		private readonly jwtService: JwtService) {}

	async validateUser(userDetails: UserInterface) : Promise<User> {
		const user: User = await this.usersService.findOneByID(userDetails.id);
		if (!user)
			return this.usersService.createUser(userDetails);

		return user;
	}

	/* https://docs.nestjs.com/security/authentication#jwt-functionality */
	async login(user: User) : Promise<any> {
		const payload = { login: user.login, sub: user.id };

		this.usersService.updateLastLogin(user);
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}