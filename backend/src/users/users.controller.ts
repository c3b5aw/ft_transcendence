import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
	
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
	getUserFriens() {}

	@Get('/:id/avatar')
	@UseGuards(JwtGuard)
	getUserAvatar() {}

	@Get('/:id/achievements')
	@UseGuards(JwtGuard)
	getUserAchievements() {}
}