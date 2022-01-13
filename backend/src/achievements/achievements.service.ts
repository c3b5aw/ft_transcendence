import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';

import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user_achievements.entity';

@Injectable()
export class AchievementsService {

	constructor(
		@InjectRepository(Achievement) private readonly achievementRepository: Repository<Achievement>,
		@InjectRepository(UserAchievement) private readonly userAchievementRepository: Repository<UserAchievement>) {}

	async findOneByID(id: number) : Promise<Achievement> {
		return this.achievementRepository.findOne( id );
	}

	async findAll() : Promise<Achievement[]> {
		return this.achievementRepository.find();
	}

	async findUserAchievementsById(id: number) : Promise<UserAchievement[]> {
		return this.userAchievementRepository.find({ 
			select: ['user_id', 'achievement_id', 'unlocked_at'],
			where: { user_id: id }
		});
	}

	async sendAvatar(id: number, resp: Response) {
		resp.sendFile( `${id}.png`, { root: './public/achievements' }, (err) => {
			if (err) {
				resp.header('Content-Type', 'application/json');
				resp.status(404).json({
					error: 'File not found',
				});
			}
		});
	}
}