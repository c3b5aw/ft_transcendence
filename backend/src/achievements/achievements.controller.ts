import { Controller, Get, UseGuards, Header, Param, Res } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { Achievement } from './entities/achievement.entity';

import { AchievementsService } from './achievements.service';

@ApiTags('achievements')
@ApiCookieAuth()
@UseGuards(JwtGuard)
@Controller('achievements')
export class AchievementsController {

	constructor(private readonly achievementsService: AchievementsService) {}

	@Get()
	@Header('Content-Type', 'application/json')
	async getAchievements() : Promise<Achievement[]> {
		return this.achievementsService.findAll();
	}

	@Get('/:id')
	@Header('Content-Type', 'application/json')
	async getAchievement(@Param('id') id: number, @Res() resp: Response) {
		const achievement: Achievement = await this.achievementsService.findOneByID( id );
		if (!achievement)
			return resp.status(404).json({ error: 'achievement not found' });
		resp.send(achievement);
	}

	@Get('/:id/avatar')
	@Header('Content-Type', 'image/png')
	async getAchievementAvatar(@Param('id') id: number, @Res() resp: Response) {
		return this.achievementsService.sendAvatar( id, resp );
	}
}