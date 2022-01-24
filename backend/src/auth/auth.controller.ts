import { Controller, Get, Header, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiCookieAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
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
	@ApiOperation({ summary: 'Login using 42OAuth' })
	async login() {}

	@Get('/status')
	@ApiCookieAuth()
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get your auth status' })
	async status(@Req() req: any, @Res() resp: Response) {
		let isAuthenticated: boolean, isTwoFaAuthenticated: boolean = false;
	
		try {
			if (req.cookies.access_token) {
				let payload: any = await this.authService.verifyToken(req.cookies.access_token);

				isTwoFaAuthenticated = req.user.two_factor_auth ? payload.is_2fa_valid : true;
				isAuthenticated = true;
			}
		} catch (e) {}
		resp.send({ isTwoFaAuthenticated, isAuthenticated, user: req.user });
	}

	@Get('/redirect')
	@ApiOperation({ summary: 'Redirect to main page' })
	async redirect(@Res() resp: Response) {
		resp.status(302).redirect('/');
	}

	@Get('/42/callback')
	@ApiBasicAuth()
	@UseGuards(Intra42Guard)
	@ApiOperation({ summary: '42 Redirect endpoint' })
	async callback_42(@Req() req: any, @Res({ passthrough: true }) resp: Response) {
		if (req.user)
			await this.authService.sendCookie(req, resp, false);
		resp.status(302).redirect('/api/auth/redirect');
	}

	@Get('/logout')
	@ApiOperation({ summary: 'Destroy your session' })
	logout(@Req() req: Request, @Res({ passthrough: true }) resp: Response) {
		if (req.session)
			req.session.destroy(() => {});

		resp.clearCookie('access_token');
		resp.status(302).redirect('/');
	}
}