import { Module } from '@nestjs/common';

import { HttpModule} from '@nestjs/axios';
import { UsersModule } from 'src/users/users.module';

import { AuthService } from './auth.service';
import { Intra42Strategy  } from './strategy/intra42.strategy';
import { SessionSerializer } from './components/serializer';

import { AuthController } from './auth.controller';

@Module({
	imports: [
		HttpModule,
		UsersModule,
	],
	providers: [
		AuthService,
		Intra42Strategy,
		SessionSerializer,
	],
	controllers: [
		AuthController,
	]
})

export class AuthModule {} 