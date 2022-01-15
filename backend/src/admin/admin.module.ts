import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AdminController } from './admin.controller';
import { AdminStrategy } from './strategies/admin.stragy';

@Module({
	imports: [ UsersModule ],
	controllers: [ AdminController ],
	providers: [ AdminStrategy ],
	exports: [],
})

export class AdminModule {}