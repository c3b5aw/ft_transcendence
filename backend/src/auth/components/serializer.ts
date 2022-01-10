import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

/*
	https://stackoverflow.com/questions/19948816/passport-js-error-failed-to-serialize-user-into-session

	Why .id: https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize

	https://www.passportjs.org/docs/configure/ - view session part
*/

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(private readonly usersService: UsersService) {
		super();
	}

	serializeUser(user: User, done: Function) {
		done(null, user.id)
	}

	async deserializeUser(id: number, done: Function) {
		const user: User = await this.usersService.findOneByID(id);
		if (!user) {
			return done(null, null);
		}
		this.usersService.updateLastLogin(user);
		return done(null, user);
	}
}