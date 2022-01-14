import { Module } from '@nestjs/common';
import { AdminStrategy } from './strategies/admin.stragy';

@Module({
	imports: [],
	controllers: [],
	providers: [ AdminStrategy ],
	exports: [],
})

export class AdminModule {}