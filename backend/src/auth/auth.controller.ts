import { Controller, Get, Header, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Session } from 'express-session';

import { Intra42Guard } from './guards/intra42.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

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

	@Get('42/callback')
	@UseGuards(Intra42Guard)
	@Redirect('/api/auth/status', 301)
	redirect() {}

	@Get('logout')
	@Header('Content-Type', 'application/json')
	@UseGuards(Intra42Guard)
	@ApiResponse({ status: 200, description: 'User session has been logged out.' })
	logout(@Req() req: { session: Session }): string {
		if (req.session) {
			req.session.destroy(() => {});
		}
		return JSON.stringify({
			status: "OK"
		});
	}
}