import { Controller, Get, Header, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Session } from 'express-session';
import { response, Response } from 'express';

import { AuthService } from './auth.service';
import { Intra42Guard } from './guards/intra42.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) {}

	@Get('login')
	@UseGuards(Intra42Guard)
	async login() {}

	@Get('status')
	@Header('Content-Type', 'application/json')
	status(@Req() req: any): string {
		if (req.isAuthenticated()) {
			return JSON.stringify({
				isAuthenticated: true,
				user: {
					id: req.user.id,
					login: req.user.login,
				}
			});
		}
		return JSON.stringify({
			isAuthenticated: false,
		});
	}

	@Get('redirect')
	async redirect(@Req() req: any, @Res() resp: Response) {
		if (!req.isAuthenticated())
			return resp.status(302).redirect('/');
		
		const jwt = await this.authService.login(req.user);
		resp.cookie('access_token', jwt.access_token, {
			httpOnly: false,
		});

		return resp.status(302).redirect('/');
	}

	@Get('42/callback')
	@UseGuards(Intra42Guard)
	@Redirect('/api/auth/redirect', 301)
	callback_42() {}

	@Get('logout')
	logout(@Req() req: { session: Session }, @Res() resp: Response) {
		if (req.session) {
			req.session.destroy(() => {});
		}
		
		/*
			https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie

			Max-Age=<number> Optional
    		Indicates the number of seconds until the cookie expires. A zero or negative number will expire the cookie immediately. If both Expires and Max-Age are set, Max-Age has precedence.
		*/
		resp.cookie('access_token', '', {
			httpOnly: false,
			maxAge: 0,
		});

		return resp.status(302).redirect('/');
	}
}