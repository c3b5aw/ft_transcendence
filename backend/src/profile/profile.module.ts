import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { ProfileController } from './profile.controller';
import { UsersModule } from 'src/users/users.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
	imports: [
		MulterModule.register({
			dest: './public',
		}),
		UsersModule,
		FriendsModule,
	],
	controllers: [
		ProfileController,
	],
	providers: [],
	exports: [],
})

export class ProfileModule {}