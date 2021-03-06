import { Controller, Get, UseGuards, Header, Param, Res } from '@nestjs/common';
import { ApiCookieAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

import { JwtTwoFactorGuard } from 'src/2fa/guards/2fa.guard';

import { Achievement } from './entities/achievement.entity';

import { AchievementsService } from './achievements.service';

@ApiTags('achievements')
@ApiCookieAuth()
@UseGuards(JwtTwoFactorGuard)
@Controller('achievements')
export class AchievementsController {

	constructor(private readonly achievementsService: AchievementsService) {}

	@Get()
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get achievements list' })
	async getAchievements() : Promise<Achievement[]> {
		return this.achievementsService.findAll();
	}

	@Get('/:id')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get achievement details' })
	async getAchievement(@Param('id') id: number, @Res() resp: Response) {
		const achievement: Achievement = await this.achievementsService.findOneByID( id );
		if (!achievement)
			return resp.status(404).json({ error: 'achievement not found' });
		resp.send(achievement);
	}

	@Get('/:id/avatar')
	@Header('Content-Type', 'image/png')
	@ApiOperation({ summary: 'Get achievement avatar as png' })
	async getAchievementAvatar(@Param('id') id: number, @Res() resp: Response) {
		return this.achievementsService.sendAvatar( id, resp );
	}
}