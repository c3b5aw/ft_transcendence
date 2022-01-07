import { Module } from '@nestjs/common';
import { HttpModule} from '@nestjs/axios';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { Intra42Strategy } from './intra42.strategy';
import { UsersService } from 'src/users/users.service';

@Module({
	imports: [
		HttpModule,
	],
	providers: [
		AuthService,
		UsersService,
		Intra42Strategy,
	],
	controllers: [
		AuthController,
	]
})

export class AuthModule {} 