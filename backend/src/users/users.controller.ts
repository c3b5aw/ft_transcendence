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

	@Get()
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getUsers() : Promise<User[]> {
		const users: User[] = await this.userService.findUsers();
		return users;
	}

	@Get('/:id')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getUser(@Param('id') id: number, @Res() resp: Response) {
		const user: User = await this.userService.findOneByID( id );

		if (!user) {
			resp.status(404).send(JSON.stringify({
				error: 'User not found',
			}));
		}
		resp.send(user);
	}

	@Get('/:id/stats')
	@UseGuards(JwtGuard)
	getUserStats() {
		// return stats interface?
	}

	// @Get('/:id/matchs')
	// @UseGuards(JwtGuard)
	// async getUserMatchs(@Param('id') id: number) {
	// }

	@Get('/:id/avatar')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'image/jpg')
	async getUserAvatar(@Param('id') id: number, @Res() resp: Response) {
		resp.sendFile( `${id}.jpg`, { root: './uploads' }, (err) => {
			if (err) {
				resp.sendFile( `default.jpg`, { root: './uploads'}, (err_fallback) => {
					if (err_fallback) {
						console.log(err_fallback);
						resp.header('Content-Type', 'application/json');
						resp.status(404).send(JSON.stringify({
							error: 'File not found',
						}));
					}
				})
			}
		});
	}

	// return list of achivements, must be fetched later on?
	// @Get('/:id/achievements')
	// @UseGuards(JwtGuard)
	// getUserAchievements() {}

	// Get all friends
	// @Get('/:id/friends')
	// @UseGuards(JwtGuard)
	// getFriend() {}

	// Accept friend request
	// @Put('/:id/friends/')

	// Add a friend (send a friend request)
	// @Post('/:id/friend')
	// @UseGuards(JwtGuard)
	// addFriend() {}

	// Delete a friend or a friend request
	// @Delete('/:id/friend')
	// @UseGuards(JwtGuard)
	// removeFriend() {}
}