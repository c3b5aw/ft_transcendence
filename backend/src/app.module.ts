import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';

import { AdminModule } from './admin/admin.module';
import { AchievementsModule } from './achievements/achievements.module';
import { AuthModule } from './auth/auth.module'
import { FriendsModule } from './friends/friends.module';
import { LadderModule } from './ladder/ladder.module';
import { MatchsModule } from './matchs/matchs.module';
import { ProfileModule } from './profile/profile.module';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';

import { Achievement, UserAchievement } from './achievements/entities/achievement.entity';
import { ChatModule } from './chat/chat.module';
import { ChatMessage } from './chat/entities/message.entity';
import { Channel, ChannelUser } from './chat/entities/channel.entity';
import { Friend } from './friends/entities/friend.entity';
import { Match } from './matchs/entities/match.entity';
import { UserStats } from './stats/entities/stats.entity';
import { User } from './users/entities/user.entity';

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
			entities: [ Achievement, Channel, ChannelUser,
						ChatMessage, Friend, Match, User, UserStats,
						UserAchievement ],
			synchronize: true,
		}),
		AchievementsModule,
		AdminModule,
		AuthModule,
		ChatModule,
		FriendsModule,
		LadderModule,
		MatchsModule,
		ProfileModule,
		StatsModule,
		UsersModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
