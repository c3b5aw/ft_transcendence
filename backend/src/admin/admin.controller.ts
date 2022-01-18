import { Controller, Put, UseGuards, 
		Header, Delete, Param, Res } from '@nestjs/common';
<<<<<<< HEAD
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
=======
import { ApiCookieAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
>>>>>>> origin/main

import { Response } from 'express';

import { AdminGuard } from 'src/admin/guards/admin.guard';

import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/roles.enum';
import { UsersService } from 'src/users/users.service';

@ApiTags('admin')
@ApiCookieAuth()
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {

	constructor(private readonly usersService: UsersService) {}

	@Put('/ban/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Ban a user' })
	async banUser(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });

<<<<<<< HEAD
		if (user.banned)
			return resp.status(200).json({ error: 'user is banned' });

=======
		if (user.role == UserRole.BANNED)
			return resp.status(200).json({ error: 'user is already banned' });
>>>>>>> origin/main
		if (user.role === UserRole.ADMIN)
			return resp.status(409).json({ error: 'admin cannot be banned' });

		await this.usersService.updateUserBan( user.id, true );
		resp.json({ message: 'user has been banned' });
	}

	@Delete('/ban/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Unban a user' })
	async unbanUser(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });

<<<<<<< HEAD
		if (!user.banned)
=======
		if (user.role !== UserRole.BANNED)
>>>>>>> origin/main
			return resp.status(200).json({ error: 'user is not banned' });

		await this.usersService.updateUserBan( user.id, false );
		resp.json({ message: 'user has been unbanned' });
	}

}