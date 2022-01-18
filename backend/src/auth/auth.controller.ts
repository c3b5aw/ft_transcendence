import { Controller, Get, Header, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { Intra42Guard } from './guards/intra42.guard';
import { JwtGuard } from './guards/jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) {}

	@Get('/login')
	@ApiBasicAuth()
	@UseGuards(Intra42Guard)
	async login() {}

	@Get('/status')
	@ApiCookieAuth()
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	status(@Req() req: any, @Res() resp: Response) {
		resp.send({
			isAuthenticated: true,
			user: req.user,
		})
	}

	@Get('/redirect')
	async redirect(@Res() resp: Response) {
		resp.status(302).redirect('/');
	}

	@Get('/42/callback')
	@ApiBasicAuth()
	@UseGuards(Intra42Guard)
	async callback_42(@Req() req: any, @Res({ passthrough: true }) resp: Response) {
		if (req.user) {
			const jwt = await this.authService.login(req.user);
			resp.cookie('access_token', jwt.access_token, {
				httpOnly: false,
			});
		}
		resp.status(302).redirect('/api/auth/redirect');
	}

	@Get('/logout')
	logout(@Req() req: Request, @Res({ passthrough: true }) resp: Response) {
		if (req.session)
			req.session.destroy(() => {});

		resp.clearCookie('access_token');
		resp.status(302).redirect('/');
	}
}