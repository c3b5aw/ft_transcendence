import { Controller, Get, Header, Inject, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { LadderService } from './ladder.service';

@ApiTags('ladder')
@Controller('ladder')
export class LadderController {
	constructor(@Inject(LadderService) private readonly ladderService: LadderService) {}

	@Get('/')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getLadder(): Promise<string> {
		const ladder = await this.ladderService.getLadder();

		return JSON.stringify(ladder);
	}

}