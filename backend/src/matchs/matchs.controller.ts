import { Controller, Get, Res,
		Param, UseGuards, Header } from '@nestjs/common';
import { ApiTags, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

import { AdminGuard } from 'src/admin/guards/admin.guard';

import { Match } from './entities/match.entity';
import { MatchsService } from './matchs.service';
import { JwtTwoFactorGuard } from 'src/2fa/guards/2fa.guard';

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

	@Get('/in-progress')
	@UseGuards(JwtTwoFactorGuard)
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get all in progress matchs' })
	async getInProgress(@Res() resp: Response) {
		const matchs: Match[] = await this.matchsService.findAllInProgress();
		resp.send(matchs);
	}

	@Get('/:hash')
	@UseGuards(JwtTwoFactorGuard)
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get match details' })
	async getMatchByHash(@Param('hash') hash: string, @Res() resp: Response) {

		console.log(hash);

		const match: Match = await this.matchsService.findOneByHash( hash );
		if (!match)
			return resp.status(404).json({ error: 'match not found' });
		resp.send(match);
	}
}