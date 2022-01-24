import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from 'src/users/users.module';
import { MatchmakingGateway } from './matchmaking.gateway';

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
	controllers: [],
	providers: [ MatchmakingGateway ],
	exports: [],
})

export class MatchmakingModule {}