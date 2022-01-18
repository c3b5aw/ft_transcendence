import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { ApiTags, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@ApiTags('ladder')
@ApiCookieAuth()
@UseGuards(JwtGuard)
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