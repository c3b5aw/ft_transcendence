import { Controller, Get, Res,
		Param, UseGuards, Header } from '@nestjs/common';
<<<<<<< HEAD
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
=======
import { ApiTags, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
>>>>>>> origin/main
import { Response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/admin/guards/admin.guard';

import { Match } from './entities/match.entity';
import { MatchsService } from './matchs.service';

@ApiTags('matchs')
@ApiCookieAuth()
@Controller('matchs')
export class MatchsController {
	
	constructor(private readonly matchsService: MatchsService) {}

	@Get('/count')
	@UseGuards(AdminGuard)
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get number of total matchs played' })
	async countAll(@Res() resp: Response) {
		const total = await this.matchsService.countAll();
		resp.send({ total });
	}

	@Get('/:id')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get match details' })
	async getMatch(@Param('id') id: number, @Res() resp: Response) {
		const match: Match = await this.matchsService.findOneById( id );
		if (!match)
			return resp.status(404).json({ error: 'match not found' });
		resp.send(match);
	}
}