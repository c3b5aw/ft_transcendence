import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatsService } from './stats.service';
import { UserStats } from './entities/stats.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserStats]),
	],
	controllers: [],
	providers: [ StatsService ],
	exports: [ StatsService ]
})

export class StatsModule {}