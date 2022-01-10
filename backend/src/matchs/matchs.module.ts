import { Module } from '@nestjs/common';

import { MatchsService } from './matchs.service';
import { MatchsController } from './matchs.controller';

@Module({
	imports: [],
	controllers: [
		MatchsController,
	],
	providers: [
		MatchsService,
	],
	exports: [],
})

export class MatchsModule {}