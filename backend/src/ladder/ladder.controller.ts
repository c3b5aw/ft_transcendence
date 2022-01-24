import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { ApiTags, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { JwtTwoFactorGuard } from 'src/2fa/guards/2fa.guard';

@ApiTags('ladder')
@ApiCookieAuth()
@UseGuards(JwtTwoFactorGuard)
@Controller('ladder')
export class LadderController {
	constructor(private readonly usersService: UsersService) {}

	@Get('/')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get ladder' })
	async getLadder(): Promise<string> {
		const ladder: User[] = await this.usersService.getLadder();

		return JSON.stringify(ladder);
	}
}