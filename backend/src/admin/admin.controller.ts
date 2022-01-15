import { Controller, Put, UseGuards, 
		Header, Patch, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { AdminGuard } from 'src/admin/guards/admin.guard';

import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/roles.enum';
import { UsersService } from 'src/users/users.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {

	constructor(private readonly usersService: UsersService) {}

	@Put('/ban/:login')
	@UseGuards(AdminGuard)
	@Header('Content-Type', 'application/json')
	async banUser(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });

		if (user.banned)
			return resp.status(409).json({ error: 'user already banned' });

		if (user.role === UserRole.ADMIN)
			return resp.status(409).json({ error: 'admin cannot be banned' });

		await this.usersService.updateUserBan( user.id, true );
		resp.json({ message: 'user has been banned' });
	}

	@Patch('/ban/:login')
	@UseGuards(AdminGuard)
	@Header('Content-Type', 'application/json')
	async unbanUser(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });

		if (!user.banned)
			return resp.status(409).json({ error: 'user is not banned' });

		await this.usersService.updateUserBan( user.id, false );
		resp.json({ message: 'user has been unbanned' });
	}

}