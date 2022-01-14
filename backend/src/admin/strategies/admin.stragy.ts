import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { UserRole } from 'src/users/entities/roles.enum';

export class InsufficientPermissionsException extends UnauthorizedException {
	constructor() {
		super('insufficient permissions');
	}
}

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
	constructor() {
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
		if (payload.role != UserRole.ADMIN)
			throw new InsufficientPermissionsException();

		return true;
	}
}