import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

import { AuthService } from './auth.service';
import { Intra42Strategy  } from './strategy/intra42.strategy';
import { SessionSerializer } from './components/serializer';

import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { 
				expiresIn: Number(process.env.JWT_EXPIRATION) 
			},
		}),
		UsersModule,
	],
	providers: [
		AuthService,
		Intra42Strategy,
		JwtStrategy,
		SessionSerializer,
	],
	controllers: [ AuthController ]
})

export class AuthModule {} 