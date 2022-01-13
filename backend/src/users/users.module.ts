import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
=======
import { AchievementsModule } from 'src/achievements/achievements.module';
>>>>>>> origin/backend-login-rewrite
import { FriendsModule } from 'src/friends/friends.module';
import { MatchsModule } from 'src/matchs/matchs.module';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
<<<<<<< HEAD
=======
		AchievementsModule,
>>>>>>> origin/backend-login-rewrite
		MatchsModule,
		FriendsModule,
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