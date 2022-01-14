import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/roles.enum';
import { UsersService } from 'src/users/users.service';

export class InsufficientPermissionsException extends UnauthorizedException {
	constructor() {
		super('insufficient permissions');
	}
}

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
	constructor(private readonly userService: UsersService) {
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
		const user: User = await this.usersService.findOneByID( payload.sub );
		if (user.role != UserRole.ADMIN)
			throw new InsufficientPermissionsException();

		return true;
	}
}