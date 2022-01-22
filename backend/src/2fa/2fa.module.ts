import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { TwoAuthFactorController } from './2fa.controller';

import { TwoAuthFactorService } from './2fa.service';

@Module({
	imports: [ UsersModule, AuthModule ],
	controllers: [ TwoAuthFactorController ],
	providers: [ TwoAuthFactorService ],
	exports: [ TwoAuthFactorService ]
})

export class TwoAuthFactorModule {}