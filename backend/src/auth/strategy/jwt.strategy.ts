import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

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
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
		})
	}

	async validate(payload: any): Promise<User> {
		const user: User = await this.userService.findOneByLogin(payload.login);

        if (!user)
            throw new UnauthorizedException();
        return user;
    }
}