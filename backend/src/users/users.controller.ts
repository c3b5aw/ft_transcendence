import { Controller, Get, Put, Delete,
		UseGuards, Param, Res, Header, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { User } from './entities/user.entity';
import { UserStats } from './dto/stats.dto';
import { UsersService } from './users.service';

import { Match } from 'src/matchs/entities/match.entity';
import { MatchsService } from 'src/matchs/matchs.service';

import { Friend } from 'src/friends/entities/friend.entity';
import { FriendsService } from 'src/friends/friends.service';

@ApiTags('users')
@Controller('users')
export class UsersController {

	constructor(private readonly userService: UsersService,
		private readonly friendsService: FriendsService,
		private readonly matchService: MatchsService) {}

	@Get()
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getUsers() : Promise<User[]> {
		const users: User[] = await this.userService.findAll();
		return users;
	}

	@Get('/me')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getMyself(@Req() req: any) : Promise<User> {
		return this.userService.findMe(req.user.id);
	}

	@Get('/:id')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getUser(@Param('id') id: number, @Res() resp: Response) {
		const user: User = await this.userService.findOneByID( id );
		if (!user)
			resp.status(404).json({ error: 'User not found' });
		resp.send(user);
	}

	@Get('/:id/stats')
	@UseGuards(JwtGuard)
	async getUserStats(@Param('id') id: number, @Res() resp: Response) {
		const userStats: UserStats = await this.userService.getStatsByID( id );
		if (!userStats)
			resp.status(404).json({ error: 'User not found' });
		resp.send(userStats);
	}

	@Get('/:id/matchs')
	@UseGuards(JwtGuard)
	async getUserMatchs(@Param('id') id: number) {
		const matchs: Match[] = await this.matchService.findAllByID( id );
		return matchs;
	}

	@Get('/:id/avatar')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'image/jpg')
	async getUserAvatar(@Param('id') id: number, @Res() resp: Response) {
		resp.sendFile( `${id}.jpg`, { root: './public/avatars' }, (err) => {
			if (err) {
				resp.sendFile( `default.jpg`, { root: './public/avatars'}, (err_fallback) => {
					if (err_fallback) {
						console.log(err_fallback);
						resp.header('Content-Type', 'application/json');
						resp.status(404).json({
							error: 'File not found',
						});
					}
				})
			}
		});
	}

	// return list of achivements, must be fetched later on?
	// @Get('/:id/achievements')
	// @UseGuards(JwtGuard)
	// getUserAchievements() {}

	// Get all ACCEPTED friends
	@Get('/:id/friends')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getFriend(@Param('id') id: number) : Promise<Friend[]> {
		return this.friendsService.findAllAcceptedByID( id );
	}

	// Accept friend request
	// @Put('/:id/friends/')

	// Add a friend (send a friend request)
	// @Post('/:id/friend')
	// @UseGuards(JwtGuard)
	// addFriend() {}

	// Delete a friend or a friend request
	@Delete('/:id/friend')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async removeFriend(@Req() req: any, @Param('id') id: number, 
						@Res() resp: Response) {
		const ok: boolean = await this.friendsService.removeFriend(
			req.user.id, id
		)
		if (!ok)
			return resp.status(404).json({
				error: 'Friendship not found',
			});
		resp.json({
			message: 'Friendship deleted',
		})
	}
}