import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(private usersService: UsersService) {}

	async findUser(username: string) : Promise<any> {
		const user = this.usersService.findOne(username);
		if (!user)
			throw new UnauthorizedException();
		return user;
	}
}