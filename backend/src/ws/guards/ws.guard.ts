import { Injectable, CanActivate, ExecutionContext, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/entities/user.entity';
import { UserStatus } from 'src/users/entities/status.enum';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/entities/roles.enum';

import { WSClient } from 'src/ws/datastructures/wsclient.struct';

@Injectable()
export class WsGuard implements CanActivate {

	constructor(private readonly usersService: UsersService,
		private readonly jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<any> {
		const client: WSClient = context.switchToWs().getClient();

		try {
			const token = WsGuard.__findToken(client.handshake.headers);

			const user: User = await WsGuard.__verifyToken(token, this.jwtService, this.usersService);

			client.user = user;
			return true;
		} catch (ex) {
			client.emit('onError', { error: 'invalid authentication token' });
			client.disconnect();

			return false;
		}
	}

	public static async verify(client: WSClient, jwtService: JwtService, usersService: UsersService): Promise<User> {
		try {
			const token = this.__findToken(client.handshake.headers);
			const user: User = await this.__verifyToken(token, jwtService, usersService);

			client.user = user;
			return user;
		} catch (ex) {
			client.emit('onError', { error: 'invalid authentication token' });
			client.disconnect();

			return null;
		}
	}

	public static async __verifyToken(token: string, jwtService: JwtService, usersService: UsersService): Promise<User> {
		const payload = jwtService.verify(token, { ignoreExpiration: false });
		if (!payload)
			throw new Error('invalid token');

		const user = await usersService.findOneByIDWithCreds(payload.sub);
		if (!user)
			throw new Error('user not found');

		if (user.role === UserRole.BANNED)
			throw new Error('user is banned');

		delete user.two_factor_auth_secret;
		if (!(!user.two_factor_auth || payload.is_2fa_valid))
			throw new Error('2fa is required');

		if (user.status === UserStatus.IN_GAME)
			throw new Error('user already in-game');

		return user;
	}

	public static __findToken(headers: any): string {
		if (!headers.hasOwnProperty('cookie') || !headers.cookie)
			throw new Error('no cookie header found');

		const cookies = headers.cookie.split('; ');
		const jwt_cookie: string = cookies.find(cookie => cookie.startsWith('access_token='));
		if (!jwt_cookie)
			throw new Error('no access_token cookie found');

		return jwt_cookie.split('=')[1];
	}
}
