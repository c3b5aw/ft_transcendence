import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { TwoAuthFactorController } from './2fa.controller';

import { TwoAuthFactorService } from './2fa.service';
import { JwtTwoFactorStrategy } from './strategies/2fa.strategy';

@Module({
	imports: [ UsersModule, AuthModule ],
	controllers: [ TwoAuthFactorController ],
	providers: [ TwoAuthFactorService, JwtTwoFactorStrategy ],
	exports: [ TwoAuthFactorService ]
})

export class TwoAuthFactorModule {}