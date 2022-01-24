import { Injectable } from '@nestjs/common';

import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TwoAuthFactorService {

	constructor(private readonly usersService: UsersService) {}

	public async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(user.email, "TRANSCENDENCE", secret);

		await this.usersService.setTwoFactorAuthenticationSecret(user.id, secret);
		return { secret, otpauthUrl };
	}

	public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
		return toFileStream(stream, otpauthUrl);
	}

	public async isTwoFactorAuthenticationCodeValid(twoFaCode: string, user: User) {
		const usr: User = await this.usersService.findOneByIDWithCreds(user.id);
		if (!usr || usr.two_factor_auth_secret === undefined)
			return false;

		return authenticator.verify({
			token: twoFaCode, secret: usr.two_factor_auth_secret });
	}
}