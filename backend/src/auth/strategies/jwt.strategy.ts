import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/entities/roles.enum';

/*
	https://docs.nestjs.com/security/authentication#implementing-passport-jwt
*/

export class AuthBannedException extends UnauthorizedException {
	constructor() {
		super('user is banned');
	}
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly userService: UsersService) {
		super({
			secretOrKey: process.env.JWT_SECRET,
			ignoreExpiration: false,
			jwtFromRequest: (req: Request) => {
				if (!req || !req.cookies) return null;
				return req.cookies['access_token'];
			},
		})
	}

	async validate(payload: any): Promise<User> {
		const user: User = await this.userService.findOneByIDWithCreds(payload.sub);
		if (!user || user.role === UserRole.BANNED)
			throw new AuthBannedException();

		delete user.two_factor_auth_secret;		
		return user;
	}
}