import { Module } from '@nestjs/common';

import { LadderController } from './ladder.controller';

import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [ UsersModule ],
	controllers: [ LadderController],
	providers: [],
	exports: [],
})

export class LadderModule {}