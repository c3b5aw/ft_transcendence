import { Controller, Get, Put, Post, Delete,
		UseGuards, Param, Res, Header, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { AchievementsService } from 'src/achievements/achievements.service';

import { Friend } from 'src/friends/entities/friend.entity';
import { FriendsService } from 'src/friends/friends.service';

import { Match } from 'src/matchs/entities/match.entity';
import { MatchsService } from 'src/matchs/matchs.service';

import { User } from './entities/user.entity';
import { UserStats } from './dto/stats.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {

	constructor(
		private readonly achievementsService: AchievementsService,
		private readonly usersService: UsersService,
		private readonly friendsService: FriendsService,
		private readonly matchService: MatchsService) {}

	@Get()
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getUsers() : Promise<User[]> {
		return this.usersService.findAll();
	}

	@Get('/:login')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getUser(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			resp.status(404).json({ error: 'User not found' });
		resp.send(user);
	}

	@Get('/:login/stats')
	@UseGuards(JwtGuard)
	async getUserStats(@Param('login') login: string, @Res() resp: Response) {
		const userStats: UserStats = await this.usersService.getStatsByLogin( login );
		if (!userStats)
			return resp.status(404).json({ error: 'User not found' });
		resp.send(userStats);
	}

	@Get('/:login/matchs')
	@UseGuards(JwtGuard)
	async getUserMatchs(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'User not found' });

		const matchs: Match[] = await this.matchService.findAllById( user.id );
		return matchs;
	}

	@Get('/:login/avatar')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'image/jpg')
	async getUserAvatar(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'User not found' });

		return await this.usersService.sendAvatar( user.id, resp );
	}

	/*
		ACHIEVEMENTS
	*/

	@Get('/:login/achievements')
	@UseGuards(JwtGuard)
	async getUserAchievements(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'User not found' });

		return this.achievementsService.findUserAchievementsById( user.id );
	}

	/*
		FRIENDS
	*/

	@Get('/:login/friends')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getFriend(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'User not found' });

		return this.friendsService.findAllAcceptedById( user.id );
	}

	@Put('/:login/friend')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async acceptFriend(@Req() req: any, 
						@Param('login') login: string, @Res() resp: Response) {

		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'User not found' });

		const ok: string = await this.friendsService.findOneAcceptedByBothId(req.user.id, user.id)

		if (ok == 'not_friend')
			return resp.status(404).json({ error: 'Friendship not found' });
		else if (ok == 'not_pending')
			return resp.status(409).json({ error: 'Friendship is not pending' });
		resp.json({ message: 'Friendship accepted' });
	}

	@Post('/:login/friend')
	@UseGuards(JwtGuard)
	async addFriend(@Req() req: any,
					@Param('login') login: string, @Res() resp: Response) {
		const user = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'User not found' });
		
		const state : string = await this.friendsService.addFriend( req.user.id, user.id );
		if (!state || state == 'already_friend')
			return resp.status(409).json({ error: 'Already friend' });
		return resp.status(201).json({ message: 'Friendship request sent' });
	}

	@Delete('/:login/friend')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async removeFriend(@Req() req: any, @Param('login') login: string, 
						@Res() resp: Response) {
		const user = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'User not found' });
		
		const ok: boolean = await this.friendsService.removeFriend( req.user.id, user.id );
		if (!ok)
			return resp.status(404).json({ error: 'Friendship not found' });
		resp.json({ message: 'Friendship deleted' });
	}
}