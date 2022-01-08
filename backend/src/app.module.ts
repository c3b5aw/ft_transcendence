import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';

import { AuthModule } from './auth/auth.module'

import { User } from './users/entities/user.entity';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			// https://docs.nestjs.com/techniques/database
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: Number(process.env.POSTGRES_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,

			entities: [ User ],
			
			synchronize: true,
		}),
		AuthModule
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
