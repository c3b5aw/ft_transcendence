import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';

import { UserInterface } from 'src/users/interfaces/user.interface';

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, 'Intra42') {
	constructor(private authService: AuthService) {
		super({
			clientID: process.env.INTRA42_UID,
			clientSecret: process.env.INTRA42_SECRET,
			callbackURL: process.env.INTRA42_CALLBACK_URL,
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
		const userIface: UserInterface = {
			id: profile.id,
			login: profile.username,
			displayName: profile.displayName,
			email: profile.emails[0].value,
			avatar: profile.photos[0].value,
		}

		const user = await this.authService.findUser(userIface.login);
		if (!user) {
			return new UnauthorizedException();
		}

		return user;
	}
}