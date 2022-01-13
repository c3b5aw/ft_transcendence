import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { FriendsModule } from 'src/friends/friends.module';
import { MatchsModule } from 'src/matchs/matchs.module';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		AchievementsModule,
		MatchsModule,
		FriendsModule,
	],
	controllers: [ UsersController ],
	providers: [ UsersService ],
	exports: [ UsersService ]
})

export class UsersModule {}