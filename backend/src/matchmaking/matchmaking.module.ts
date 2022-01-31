import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MatchsModule } from 'src/matchs/matchs.module';

import { UsersModule } from 'src/users/users.module';

import { MatchmakingGateway } from './matchmaking.gateway';
import { MatchmakingService } from './matchmaking.service';
import { MatchmakingController } from './matchmaking.controller';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { 
				expiresIn: Number(process.env.JWT_EXPIRATION) 
			},
		}),
		UsersModule, MatchsModule
	],
	controllers: [ MatchmakingController ],
	providers: [ MatchmakingGateway, MatchmakingService ],
	exports: [],
})

export class MatchmakingModule {}