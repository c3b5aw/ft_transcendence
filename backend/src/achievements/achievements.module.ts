import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user_achievements.entity';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Achievement]),
		TypeOrmModule.forFeature([UserAchievement]),
	],
	controllers: [
		AchievementsController,
	],
	providers: [
		AchievementsService,
	],
	exports: [
		AchievementsService,
	]
})

export class AchievementsModule {}