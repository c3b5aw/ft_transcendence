import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { Response } from 'express';

import { Achievement, UserAchievement } from './entities/achievement.entity';

@Injectable()
export class AchievementsService {

	constructor(@InjectRepository(Achievement) 
	private readonly achievementRepository: Repository<Achievement>) {}

	async findOneByID(id: number) : Promise<Achievement> {
		return this.achievementRepository.findOne( id );
	}

	async findAll() : Promise<Achievement[]> {
		return this.achievementRepository.find();
	}

	async findUserAchievementsById(id: number) : Promise<UserAchievement[]> {
		return getManager().query(`
			SELECT ua.achievement_id, ua.unlocked_at,
				a.name as achievement_name,
				a.description as achievement_description,
			CONCAT('/api/achievements/', a.id, '/avatar') as achievement_avatar
			FROM users_achievements AS ua
			INNER JOIN achievements AS a on ua.achievement_id = a.id
			WHERE ua.user_id = ${id};
		`);
	}

	async sendAvatar(id: number, resp: Response) {
		resp.sendFile( `${id}.png`, { root: './public/achievements' }, (err) => {
			if (err) {
				resp.header('Content-Type', 'application/json');
				resp.status(404).json({
					error: 'file not found',
				});
			}
		});
	}
}