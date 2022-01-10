import { Controller, Get, Put, Delete, UseGuards, Param, Res, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
	
	@Get('/')
	@UseGuards(JwtGuard)
	getUsers() {}

	@Get('/:id')
	@UseGuards(JwtGuard)
	getUser() {}

	@Get('/:id/stats')
	@UseGuards(JwtGuard)
	getUserStats() {}

	@Get('/:id/rank')
	@UseGuards(JwtGuard)
	getUserRank() {}

	@Get('/:id/matchs')
	@UseGuards(JwtGuard)
	getUserMatchs() {}

	@Get('/:id/friends')
	@UseGuards(JwtGuard)
	getUserFriends() {}

	@Get('/:id/avatar')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'image/png')
	getUserAvatar(@Param('id') id: string, @Res() resp: Response) {
		resp.sendFile(id, { root: './uploads' });
	}

	@Get('/:id/achievements')
	@UseGuards(JwtGuard)
	getUserAchievements() {}

	@Get('/:id/friends')
	@UseGuards(JwtGuard)
	getFriend() {}

	@Put('/:id/friend')
	@UseGuards(JwtGuard)
	addFriend() {}

	@Delete('/:id/friend')
	@UseGuards(JwtGuard)
	removeFriend() {}
}