import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from 'src/users/users.module';

import { GameService } from './game.service';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { 
				expiresIn: Number(process.env.JWT_EXPIRATION) 
			},
		}),
		UsersModule
	],
	controllers: [],
	providers: [ GameService ],
	exports: [],
})

export class GameModule {}