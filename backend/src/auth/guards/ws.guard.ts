import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class WsGuard implements CanActivate {

	constructor(private readonly usersService: UsersService,
		private readonly jwtService: JwtService) {}

	canActivate(context: ExecutionContext): any {
		const client = context.switchToWs().getClient();

		// console.log(context);
		// console.log(client);

		const bearerToken = "test";
		try {
			const payload: any = this.jwtService.verify(
				bearerToken, { ignoreExpiration: false });

			const user = this.usersService.findOneByID(payload.id);
			if (user)
				return user;
			
			client.disconnect();
			return false;
			// return new Promise((resolve, reject) => {
				// return this.usersService.findOneByID(payload.id).then(user => {
					// if (user)
						// resolve(user);
					// else
						// reject(false);
				// });
			// });
		} catch (ex) {
			client.disconnect();
			return false;
		}
	}
}
