import { Controller, Get, Delete, Res,
		Param, UseGuards, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { Match } from './entities/match.entity';
import { MatchsService } from './matchs.service';

@ApiTags('matchs')
@Controller('matchs')
export class MatchsController {
	
	constructor( private readonly matchsService: MatchsService) {}

	@Get('/:id')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getMatch(@Param('id') id: number, @Res() resp: Response) {
		const match: Match = await this.matchsService.findOneByID( id );
		if (!match)
			return resp.status(404).json({ error: 'Match not found' });
		return match;
	}

	// @Get('/')
	// @UseGuards(JwtGuard)
	// @Header('Content-Type', 'application/json')
	// async getMatchs() : Promise<Match[]> {
	// 	const matchs: Match[] = await this.matchsService.findAll();
	// 	return matchs;
	// }

	// @Delete('/:id')
	// @Header('Content-Type', 'application/json')
	// async deleteMatch(@Param('id') id: number, @Res() resp: Response) {
	// 	const match: Match = await this.matchsService.deleteOneByID( id );
	// 	if (!match)
	// 		return resp.status(404).json({ error: 'Match not found' });
	// 	return resp.json({ message: 'Match deleted' });
	// }
}