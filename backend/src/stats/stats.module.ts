import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatsService } from './stats.service';
import { UserStats } from './entities/stats.entity';
import { AchievementsModule } from 'src/achievements/achievements.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserStats]),
		AchievementsModule
	],
	controllers: [],
	providers: [ StatsService ],
	exports: [ StatsService ]
})

export class StatsModule {}