import { Module } from '@nestjs/common';

import { LadderService } from './ladder.service'
import { LadderController } from './ladder.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [
		UsersModule,
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