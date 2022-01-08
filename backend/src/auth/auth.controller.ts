import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { Session } from 'express-session';

import { Intra42Guard } from './guards/intra42.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

	@Get('login')
	@UseGuards(Intra42Guard)
	async login(@Req() req: any) {
		console.log('auth login', req);
	}

	@Get('logout')
	@UseGuards(Intra42Guard)
	@ApiResponse({ status: 200, description: 'User session has been logged out.' })
	logout(@Req() req: { session: Session }): string {
		req.session.destroy(() => {});
		return "OK";
	}
}