import { Controller, Get, Put, Delete,
		UseGuards, Param, Res, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
	
	constructor(private readonly userService: UsersService) {}

	// Todo: admin only
	@Get('/')
	@UseGuards(JwtGuard)
	async getUsers() : Promise<User[]> {
		const users: User[] = await this.userService.findUsers();
		return users;
	}

	@Get('/:id')
	@UseGuards(JwtGuard)
	async getUser(@Param('id') id: number) {
		const user: User = await this.userService.findOneByID( id );
		return user;
	}

	@Get('/:id/stats')
	@UseGuards(JwtGuard)
	getUserStats() {
		// return stats interface?
	}

	@Get('/:id/rank')
	@UseGuards(JwtGuard)
	getUserRank() {}

	// @Get('/:id/matchs')
	// @UseGuards(JwtGuard)
	// async getUserMatchs(@Param('id') id: number) {
	// }

	@Get('/:id/avatar')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'image/png')
	getUserAvatar(@Param('id') id: string, @Res() resp: Response) {
		resp.sendFile(id, { root: './uploads' }, (err) => {
			if (err) {
				resp.header('Content-Type', 'application/json');
				resp.status(404).send(JSON.stringify({
					error: 'File not found',
				}));
			}
		});
	}

	// return list of achivements, must be fetched later on?
	// @Get('/:id/achievements')
	// @UseGuards(JwtGuard)
	// getUserAchievements() {}

	// @Get('/:id/friends')
	// @UseGuards(JwtGuard)
	// getFriend() {}

	// @Put('/:id/friend')
	// @UseGuards(JwtGuard)
	// addFriend() {}

	// @Delete('/:id/friend')
	// @UseGuards(JwtGuard)
	// removeFriend() {}
}