import { Controller, Get, Post, UseGuards, Body,
		Res, Req, UnauthorizedException, Header } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { TwoAuthFactorService } from './2fa.service';
import { TwoFactorAuthenticationCodeDto } from './dto/TwoFactorAuthenticatioCode.dto';

@ApiTags('2fa')
@ApiCookieAuth()
@UseGuards(JwtGuard)
@Controller('2fa')
export class TwoAuthFactorController {

	constructor(private readonly twoAuthFactorService: TwoAuthFactorService,
		private readonly usersService: UsersService,
		private readonly authService: AuthService) {}

	@Get('generate')
	@ApiOperation({ summary: 'Generate a new 2FA qr-code' })
	async register(@Res() resp: any, @Req() request: any) {
		const { otpauthUrl } = await this.twoAuthFactorService.generateTwoFactorAuthenticationSecret(request.user);

		return this.twoAuthFactorService.pipeQrCodeStream(resp, otpauthUrl);
	}

	@Post('turn-on')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Turn on 2FA' })
	async turnOnTwoFactorAuthentication(@Req() request: any, 
		@Body() data: TwoFactorAuthenticationCodeDto) 
	{
		const isCodeValid = await this.twoAuthFactorService.isTwoFactorAuthenticationCodeValid(
			data.twoFactorAuthenticationCode, request.user
		);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');
		await this.usersService.setTwoFactorAuthentication(request.user.id, true);

		return { success: true };
	}

	@Post('authenticate')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Authenticate user with 2fa code' })
	public async authenticate(@Req() req: any, @Res() resp: Response,
		@Body() data : TwoFactorAuthenticationCodeDto)
	{
		const isCodeValid = this.twoAuthFactorService.isTwoFactorAuthenticationCodeValid(
			data.twoFactorAuthenticationCode, req.user);
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');

		await this.authService.sendCookie(req, resp, true);

		resp.send({ success: true });
	}

	@Get('turn-off')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Turn off 2FA' })
	async turnOffTwoFactorAuthentication(@Req() request: any, @Res() resp: Response) {
		await this.usersService.setTwoFactorAuthentication(request.user.id, false);
		await this.authService.sendCookie(request, resp, false);

		resp.send({ success: true });
	}
}