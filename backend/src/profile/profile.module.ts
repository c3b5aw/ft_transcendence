import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { ProfileController } from './profile.controller';
import { UsersModule } from 'src/users/users.module';
<<<<<<< HEAD
=======
import { FriendsModule } from 'src/friends/friends.module';
>>>>>>> origin/backend-login-rewrite

@Module({
	imports: [
		MulterModule.register({
			dest: './public',
		}),
<<<<<<< HEAD
		UsersModule
=======
		UsersModule,
		FriendsModule,
>>>>>>> origin/backend-login-rewrite
	],
	controllers: [
		ProfileController,
	],
	providers: [],
	exports: [],
})

export class ProfileModule {}