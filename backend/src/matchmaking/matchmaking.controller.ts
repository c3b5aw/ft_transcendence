import { Controller, UseGuards, Get, Header, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

import { JwtTwoFactorGuard } from 'src/2fa/guards/2fa.guard';
import { MatchmakingService } from './matchmaking.service';

@ApiTags('matchmaking')
@ApiCookieAuth()
@UseGuards(JwtTwoFactorGuard)
@Controller('matchmaking')
export class MatchmakingController {
	constructor(private readonly matchmakingServie: MatchmakingService) {}

	@Get('rooms')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get all rooms' })
	async getRooms(@Req() req: any)  {
		return this.matchmakingServie.getRooms(req.user);
	}

}