import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchsService } from './matchs.service';
import { MatchsController } from './matchs.controller';

import { User } from 'src/users/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
	],
	controllers: [
		MatchsController,
	],
	providers: [
		MatchsService,
	],
	exports: [],
})

export class MatchsModule {}