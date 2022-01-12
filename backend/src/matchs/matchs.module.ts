import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Match } from './entities/match.entity';

import { MatchsService } from './matchs.service';
import { MatchsController } from './matchs.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Match]),
	],
	controllers: [
		MatchsController,
	],
	providers: [
		MatchsService,
	],
	exports: [
		MatchsService,
	],
})

export class MatchsModule {}