import { Strategy } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, 'Intra42') {
	constructor() {
		super({
			clientID: process.env.INTRA42_UID,
			clientSecret: process.env.INTRA42_SECRET,
			callbackURL: process.env.INTRA42_CALLBACK_URL,
			scope: 'public',
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
		const user = await this.authService.findUser(profile.id);

		if (!user) {
			return new UnauthorizedException();
		}

		return user;
	}
}