import { Module } from '@nestjs/common';

import { HttpModule} from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

import { AuthService } from './auth.service';
import { Intra42Strategy  } from './strategy/intra42.strategy';
import { SessionSerializer } from './components/serializer';

import { AuthController } from './auth.controller';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { 
				expiresIn: Number(process.env.JWT_EXPIRATION) 
			},
		}),
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