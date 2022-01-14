import { Controller, Get, Delete, Res,
		Param, UseGuards, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/admin/guards/admin.guard';

import { Match } from './entities/match.entity';
import { MatchsService } from './matchs.service';

@ApiTags('matchs')
@Controller('matchs')
export class MatchsController {
	
	constructor(private readonly matchsService: MatchsService) {}

	@Get('/count')
	@UseGuards(AdminGuard, JwtGuard)
	@Header('Content-Type', 'application/json')
	async countAll(@Res() resp: Response) {
		const total = await this.matchsService.countAll();
		resp.send({ total });
	}

	@Get('/:id')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getMatch(@Param('id') id: number, @Res() resp: Response) {
		const match: Match = await this.matchsService.findOneById( id );
		if (!match)
			return resp.status(404).json({ error: 'match not found' });
		resp.send(match);
	}
}