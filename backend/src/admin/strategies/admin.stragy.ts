import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/roles.enum';
import { UsersService } from 'src/users/users.service';
import { AuthBannedException } from 'src/auth/strategies/jwt.strategy';

export class InsufficientPermissionsException extends UnauthorizedException {
	constructor() {
		super('insufficient permissions');
	}
}

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
	constructor(private readonly usersService: UsersService) {
		super({
			secretOrKey: process.env.JWT_SECRET,
			ignoreExpiration: false,
			jwtFromRequest: (req: Request) => {
				if (!req || !req.cookies) return null;
				return req.cookies['access_token'];
			}
		})
	}

	async validate(payload: any) : Promise<boolean> {
		const user: User = await this.usersService.findOneByIDWithCreds(payload.sub);
		if (!user)
			throw new UnauthorizedException();
		if (user.role === UserRole.BANNED)
			throw new AuthBannedException();
		if (user.role !== UserRole.ADMIN)
			throw new InsufficientPermissionsException();

		if (user.two_factor_auth === false)
			return true;
		
		return payload.is_2fa_valid;
	}
}