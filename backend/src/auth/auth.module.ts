import { Module } from '@nestjs/common';
import { HttpModule} from '@nestjs/axios';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UsersModule } from '../users/users.module';

import { Intra42Strategy  } from './strategy/intra42.strategy';

@Module({
	imports: [
		HttpModule,
		UsersModule,
	],
	providers: [
		AuthService,
		Intra42Strategy,
	],
	controllers: [
		AuthController,
	]
})

export class AuthModule {} 