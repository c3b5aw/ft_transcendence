import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { Request } from 'express';

import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/entities/roles.enum';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt-two-factor') {
	constructor(private readonly userService: UsersService) {
		super({
			jwtFromRequest: (req: Request) => {
				if (!req || !req.cookies) return null;
				return req.cookies['access_token'];
			},
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET
		});
	}
 
	async validate(payload: any) {
		const user = await this.userService.findOneByIDWithCreds(payload.sub);
		if (!user || user.role === UserRole.BANNED)
			throw new UnauthorizedException();

		delete user.two_factor_auth_secret;
		if (user.two_factor_auth === false || payload.is_2fa_valid)
			return user;
	
		throw new UnauthorizedException();
	}
}