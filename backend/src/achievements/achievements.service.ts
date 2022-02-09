import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { Response } from 'express';

import { Achievement, UserAchievement } from './entities/achievement.entity';
import { Match } from 'src/matchs/entities/match.entity';
import { GAME_WIN_SCORE } from 'src/game/objects/game.constants';

const ACHIVEMENTS_ID = {
	'FIRST_WIN': 1,
	'TENTH_WIN': 2,
	'WON_EVERY_ROUND': 3
}

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

	async ownAchievements(user_id: number, achievement_id: number) : Promise<boolean> {
		const achievement: UserAchievement[] = await this.achievementRepository.query(`
			SELECT *
			FROM users_achievements
			WHERE user_id = ${user_id}
			AND achievement_id = ${achievement_id};
		`);

		return achievement.length > 0;
	}

	async unlockAchievement(user_id: number, achievement_id: number) : Promise<boolean> {
		return this.achievementRepository.query(`
			INSERT INTO users_achievements (user_id, achievement_id, unlocked_at)
			VALUES (${user_id}, ${achievement_id}, NOW());
		`);
	}

	async recentlyUnlocked(user_id: number) : Promise<UserAchievement[]> {
		return this.achievementRepository.query(`
			SELECT *
			FROM users_achievements
			WHERE user_id = ${user_id}
			AND unlocked_at > NOW() - INTERVAL '1 minute';
		`);
	}

	async giveAchievement(user_id: number, achievement_id: number) {
		const owned = await this.ownAchievements(user_id, achievement_id);
		if (!owned)
			await this.unlockAchievement(user_id, achievement_id);
	}

	async updateAchievements(player: { id: number, played: number, victories: number }, match: Match) {
		const player_score = match.player1 === player.id ? match.player1_score : match.player2_score;
		const opponent_score = match.player1 === player.id ? match.player2_score : match.player1_score;

		if (player_score === GAME_WIN_SCORE && opponent_score === 0)
			await this.giveAchievement(player.id, ACHIVEMENTS_ID.WON_EVERY_ROUND);

		if (player.victories === 1)
			await this.giveAchievement(player.id, ACHIVEMENTS_ID.FIRST_WIN);

		if (player.victories === 10)
			await this.giveAchievement(player.id, ACHIVEMENTS_ID.TENTH_WIN);
	}
}