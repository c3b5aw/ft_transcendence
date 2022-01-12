import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Friend } from './entities/friend.entity';

import { FriendsService } from './friends.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Friend]),
	],
	controllers: [],
	providers: [
		FriendsService,
	],
	exports: [
		FriendsService,
	],
})

export class FriendsModule {}