import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { ProfileController } from './profile.controller';

import { AchievementsModule } from 'src/achievements/achievements.module';
import { FriendsModule } from 'src/friends/friends.module';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [
		MulterModule.register(),

		AchievementsModule,
		FriendsModule,
		UsersModule,
	],
	controllers: [ ProfileController ],
	providers: [],
	exports: [],
})

export class ProfileModule {}