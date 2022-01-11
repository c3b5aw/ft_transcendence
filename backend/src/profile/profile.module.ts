import { Module } from '@nestjs/common';

import { ProfileController } from './profile.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [
		UsersModule
	],
	controllers: [
		ProfileController,
	],
	providers: [],
	exports: [],
})

export class ProfileModule {}