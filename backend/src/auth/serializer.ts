import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(private readonly usersService: UsersService) {
		super();
	}

	serializeUser(user: User, done: Function) {
		done(null, user)
	}

	async deserializeUser(payload: User, done: Function) {
		const user = await this.usersService.findOneByLogin(payload.login);
		if (!user) {
			return done(new UnauthorizedException(), false);
		}
		return done(null, user);
	}
}