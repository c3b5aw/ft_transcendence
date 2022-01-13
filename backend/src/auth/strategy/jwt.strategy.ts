import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from "src/users/users.service";

/*
	https://docs.nestjs.com/security/authentication#implementing-passport-jwt
*/

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
		const user: User = await this.userService.findOneByID(payload.sub);

		if (!user)
			throw new UnauthorizedException();
		return user;
	}
}