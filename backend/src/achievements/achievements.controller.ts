import { Controller, Get, UseGuards, Header, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { Achievement } from './entities/achievement.entity';

import { AchievementsService } from './achievements.service';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {

	constructor(private readonly achievementsService: AchievementsService) {}

	@Get()
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getAchievements() : Promise<Achievement[]> {
		return this.achievementsService.findAll();
	}

	@Get('/:id')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getAchievement(@Param('id') id: number, @Res() resp: Response) {
		const achievement: Achievement = await this.achievementsService.findOneByID( id );
		if (!achievement)
			return resp.status(404).json({ error: 'Achievement not found' });
		resp.send(achievement);
	}

	@Get('/:id/avatar')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'image/png')
	async getAchievementAvatar(@Param('id') id: number, @Res() resp: Response) {
		return this.achievementsService.sendAvatar( id, resp );
	}
}