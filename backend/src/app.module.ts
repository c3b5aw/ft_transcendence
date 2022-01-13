import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';

import { AchievementsModule } from './achievements/achievements.module';
import { AuthModule } from './auth/auth.module'
import { FriendsModule } from './friends/friends.module';
import { LadderModule } from './ladder/ladder.module';
import { MatchsModule } from './matchs/matchs.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';

import { Friend } from './friends/entities/friend.entity';
import { Match } from './matchs/entities/match.entity';
import { User } from './users/entities/user.entity';
import { UserAchievement } from './achievements/entities/user_achievements.entity';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			// https://docs.nestjs.com/techniques/database
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: Number(process.env.POSTGRES_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,

			entities: [ Friend, Match, User ],
			
			synchronize: true,
		}),
		AchievementsModule,
		AuthModule,
		LadderModule,
		MatchsModule,
		ProfileModule,
		UsersModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
