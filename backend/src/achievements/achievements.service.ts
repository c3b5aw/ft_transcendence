import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Achievement } from "./entities/achievement.entity";
import { UserAchievement } from "./entities/user_achievements.entity";

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
}