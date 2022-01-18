import { Controller, Get, Put, Post, Delete,
		UseGuards, Param, Res, Header, Req } from '@nestjs/common';
import { ApiTags, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';

import { Response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/admin/guards/admin.guard';

import { AchievementsService } from 'src/achievements/achievements.service';

import { Friend } from 'src/friends/entities/friend.entity';
import { FriendsService } from 'src/friends/friends.service';

import { Match } from 'src/matchs/entities/match.entity';
import { MatchsService } from 'src/matchs/matchs.service';

import { User } from './entities/user.entity';
import { UserStats } from './dto/stats.dto';
import { UsersService } from './users.service';
import { UserRole } from './entities/roles.enum';

@ApiTags('users')
@ApiCookieAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {

	constructor(
		private readonly achievementsService: AchievementsService,
		private readonly usersService: UsersService,
		private readonly friendsService: FriendsService,
		private readonly matchService: MatchsService) {}

	@Get()
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get all users' })
	async getUsers(@Req() req: any) : Promise<User[]> {
		const user: User = await this.usersService.findOneByID( req.user.id );
		
		return this.usersService.findAll(user.role === UserRole.ADMIN);
	}

	@Get('/count')
	@UseGuards(AdminGuard)
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get users number' })
	async getUserCount(@Res() resp: Response) {
		const total = await this.usersService.countAll();
		resp.send({ total });
	}

	@Get('/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get user details' })
	async getUser(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });

		resp.send(user);
	}

	@Get('/:login/stats')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get user stats' })
	async getUserStats(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });

		const userStats: UserStats = await this.usersService.getStatsById( user.id );
		if (!userStats || userStats === undefined)
			return resp.status(404).json({ error: 'user not found' });
		resp.send(userStats);
	}

	@Get('/:login/matchs')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get user matchs' })
	async getUserMatchs(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });

		const matchs: Match[] = await this.matchService.findAllByPlayerId( user.id );
		resp.send(matchs);
	}

	@Get('/:login/avatar')
	@Header('Content-Type', 'image/jpg')
	@ApiOperation({ summary: 'Get user avatar as jpg' })
	async getUserAvatar(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });

		return await this.usersService.sendAvatar( user.id, resp );
	}

	/*
		ACHIEVEMENTS
	*/

	@Get('/:login/achievements')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get user achievements' })
	async getUserAchievements(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });

		const achievements = await this.achievementsService.findUserAchievementsById( user.id );
		resp.send(achievements);
	}

	/*
		FRIENDS
	*/

	@Get('/:login/friends')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get user friends list' })
	async getFriend(@Param('login') login: string, @Res() resp: Response) {
		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });

		const friends : Friend[] = await this.friendsService.findAllAcceptedById( user.id );
		resp.send(friends);
	}

	@Get('/:login/friend')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Accepted user pending friend request' })
	async acceptFriend(@Req() req: any, 
						@Param('login') login: string, @Res() resp: Response) {

		const user: User = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });

		const friend: Friend = await this.friendsService.findOnePendingByBothId(req.user.id, user.id)
		if (!friend)
			return resp.status(404).json({ error: 'pending friendship not found' });
		
		if (friend.friend_id !== req.user.id) {
			return resp.status(403).json({ error: 'you cannot accepted a request you sent' });
		}

		await this.friendsService.acceptFriend( friend.id );
		resp.json({ message: 'friendship accepted' });
	}

	@Put('/:login/friend')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Send user a friend request' })
	async addFriend(@Req() req: any,
					@Param('login') login: string, @Res() resp: Response)
	{
		const user = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });
		if (user.id == req.user.id)
			return resp.status(409).json({ error: 'you cant add yourself' });
		
		const state : string = await this.friendsService.addFriend( 
					req.user.id, req.user.login, user.id, user.login );
		if (!state || state == 'already_friend')
			return resp.status(409).json({ error: 'already friend' });
		resp.status(201).json({ message: 'friendship request sent' });
	}

	@Delete('/:login/friend')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Remove user friendship' })
	async removeFriend(@Req() req: any, @Param('login') login: string, 
						@Res() resp: Response)
	{
		const user = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });
		
		const ok: boolean = await this.friendsService.removeFriend( req.user.id, user.id );
		if (!ok)
			return resp.status(404).json({ error: 'friendship not found' });
		resp.json({ message: 'friendship deleted' });
	}

	@Put('/:login/block')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Block user' })
	async blockUser(@Req() req: any, @Param('login') login: string,
					 @Res() resp: Response)
	{
		const user = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });
		
		const state: string = await this.friendsService.updateBlocked(
				req.user.id, user.id, true);
		if (state !== null)
			return resp.status(409).json({ error: state });
		resp.json({ message: `${user.login} blocked` });
	}

	@Delete('/:login/block')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Unblock user' })
	async unblockUser(@Req() req: any, @Param('login') login: string,
					   @Res() resp: Response)
	{
		const user = await this.usersService.findOneByLogin( login );
		if (!user)
			return resp.status(404).json({ error: 'user not found' });
		
		const state: string = await this.friendsService.updateBlocked(
				req.user.id, user.id, false);
		if (state !== null)
			return resp.status(409).json({ error: state });
		resp.json({ message: `${user.login} unblocked` });
	}
}