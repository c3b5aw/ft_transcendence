import { Controller, Post, UseGuards, Body,
		Res, Req, UnauthorizedException } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
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

	@Post('generate')
	async register(@Res() response: any, @Req() request: any) {
		const { otpauthUrl } = await this.twoAuthFactorService.generateTwoFactorAuthenticationSecret(request.user);

		return this.twoAuthFactorService.pipeQrCodeStream(response, otpauthUrl);
	}

	@Post('turn-on')
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
}