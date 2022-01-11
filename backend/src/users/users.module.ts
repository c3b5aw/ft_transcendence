import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchsModule } from 'src/matchs/matchs.module';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		MatchsModule,
	],
	controllers: [
		UsersController,
	],
	providers: [
		UsersService,
	],
	exports: [
		UsersService,
	]
})

export class UsersModule {}