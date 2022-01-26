import { Injectable, Req } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Response, response } from 'express';

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
	async buildToken(curUser: User, is2FaValid: boolean) : Promise<any> {
		const user: User = await this.usersService.findOneByIDWithCreds(curUser.id);

		const payload = { login: user.login, sub: user.id, is_2fa_valid: is2FaValid };

		this.usersService.updateLastLogin(user);
		return { access_token: this.jwtService.sign(payload) };
	}

	async sendCookie(req: any, resp: Response, is2FaValid: boolean) {
		const jwt = await this.buildToken(req.user, is2FaValid);
		resp.cookie('access_token', jwt.access_token, {
			httpOnly: false,
		});
	}

	async verifyToken(token: string) {
		return this.jwtService.verify(token, { ignoreExpiration: false });
	}
}