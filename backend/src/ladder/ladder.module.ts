import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LadderService } from './ladder.service'
import { LadderController } from './ladder.controller';

import { User } from 'src/users/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
	],
	controllers: [
		LadderController
	],
	providers: [
		LadderService,
	],
	exports: [],
})

export class LadderModule {}