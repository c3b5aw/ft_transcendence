import { Controller, Delete, Get, UseGuards, Param,
		Put, Post, Header, Req, Res, Body } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { UserRole } from 'src/users/entities/roles.enum';

import { ChatService } from './chat.service';
import { Channel } from './entities/channel.entity';

import { CreateChannelDto } from './dto/createChannel.dto';
import { UpdateChannelPasswordDto } from './dto/updateChannelPassword.dto';
import { UserModerateChannel } from './dto/userModerateChannel.interface';

@ApiTags('channel')
@ApiCookieAuth()
@UseGuards(JwtGuard)
@Controller('channel')
export class ChannelController {

	constructor(private readonly chatService: ChatService) {}

	@Post()
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Create a channel' })
	async createChannel(@Body() data: CreateChannelDto,
						@Req() req: any, @Res() resp: Response)					
	{
		const unique: boolean = await this.chatService.isUniqueChannelName(data.name);
		if (!unique)
			return resp.status(409).json({ error: 'channel already exists' });

		const obj: Channel = new Channel();
		obj.name = data.name;
		obj.password = data.password;
		obj.tunnel = false;
		obj.owner_id = req.user.id;
		obj.private = data.password.length > 0;

		const channel: Channel = await this.chatService.createChannel(obj);
		await this.chatService.addUserToChannel(channel.id, req.user.id, UserRole.ADMIN);
		resp.send({ "message": "channel created", "channel": channel });
	}

	@Get('/:channelName')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get channel informations' })
	async getChannel(@Param('channelName') channelName: string, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findOneChannelByName( channelName );
		if (!channel)
			return resp.status(404).json({ error: 'channel not found' });

		resp.send(channel);
	}

	@Delete('/:channelName')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Delete a channel' })
	async deleteChannel(@Param('channelName') channelName: string,
						@Req() req: any, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findOneChannelByName(channelName);
		if (!channel)
			return resp.status(404).json({ error: 'channel not found' });

		if (channel.owner_id !== req.user.id)
			return resp.status(403).json({ error: 'you are not authorized to delete this channel' });

		await this.chatService.deleteChannel( channel );
		resp.send({ message: 'channel deleted' });
	}

	@Get('/:channelName/messages')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get channel messages' })
	async getChannelMessages(@Param('channelName') channelName: string,
							@Req() req: any, @Res() resp: Response)						
	{
		const channel: Channel = await this.chatService.findOneChannelByName(channelName);
		if (!channel)
			return resp.status(404).json({ error: 'channel not found' });

		const role: UserRole = await this.chatService.getUserRoleInChannel(channel.id, req.user.id);
		if (role === null || role === UserRole.BANNED)
			return resp.status(403).json({ error: 'you are not authorized to access this content' });

		const messages = await this.chatService.getChannelMessages(channel.id);
		resp.send(messages);
	}

	/* PWD - ADMIN ONLY*/
	@Post('/:channelName/password')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Update channel password' })
	async updateChannelPassword(@Param('channelName') channelName: string,
								@Body() data: UpdateChannelPasswordDto,
								@Req() req: any, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findOneChannelByName(channelName);
		if (!channel)
			return resp.status(404).json({ error: 'channel not found' });

		if (channel.owner_id !== req.user_id)
			return resp.status(403).json({ error: 'not enough permissions' });

		if (data.password.length === 0) {
			await this.chatService.deleteChannelPassword( channel );
			return resp.send({ message: 'channel password deleted' });
		}
		channel.password = data.password;

		await this.chatService.updateChannelPassword(channel);
		resp.send({ message: 'channel password updated' });
	}

	@Delete('/:channelName/password')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Delete channel password' })
	async deleteChannelPassword(@Param('channelName') channelName: string,
								@Req() req: any, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findOneChannelByName(channelName);
		if (!channel)
			return resp.status(404).json({ error: 'channel not found' });

		if (channel.owner_id !== req.user_id)
			return resp.status(403).json({ error: 'not enough permissions' });

		await this.chatService.deleteChannelPassword( channel );
		resp.send({ message: 'channel password deleted' });
	}

	/* MODERATOR - ADMIN ONLY */
	@Put('/:channelName/moderator/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Add a user to moderator list' })
	async addUserToModeratorList(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Req() req: any, @Res() resp: Response)
	{
		// const channel: Channel = await this.chatService.findOneChannelByName(channelName);
		// if (!channel)
		// 	return resp.status(404).json({ error: 'channel not found' });

		// if (channel.owner_id !== req.user_id)
		// 	return resp.status(403).json({ error: 'not enough permissions' });

		// const user: User = await this.usersService.findOneByLogin(login);
		// if (!user)
		// 	return resp.status(404).json({ error: 'user not found' });

		// const joined: boolean = await this.chatService.isUserInChannel(user.id, channel.id);
		// if (!joined)
		// 	return resp.status(403).json({ error: 'user is not in this channel' });
	}

	@Delete('/:channelName/moderator/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Remove a user from moderator list' })
	async removeUserFromModeratorList(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Req() req: any, @Res() resp: Response)
	{
		// const channel: Channel = await this.chatService.findOneChannelByName(channelName);
		// if (!channel)
		// 	return resp.status(404).json({ error: 'channel not found' });

		// if (channel.owner_id !== req.user_id)
		// 	return resp.status(403).json({ error: 'not enough permissions' });

		// await this.chatService.setUserModerator(channel.id, req.params.user, false);
	}

	/* BAN - KICK - MUTE - MODERATOR/ADMIN ONLY */
	@Put('/:channelName/ban/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Ban a user from a channel' })
	async banUser(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Req() req: any, @Res() resp: Response)
	{
		const u: UserModerateChannel = await this.chatService.userModerateChannel(
			req.user.id, login, channelName, resp);
		if (u.err)
			return;

		await this.chatService.setChannelUserBan(u.target.id, u.channel.id, false);
		resp.send({ message: 'user banned' });
	}

	@Delete('/:channelName/ban/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Unban a user from a channel' })
	async unbanUser(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Req() req: any, @Res() resp: Response)
	{
		const u: UserModerateChannel = await this.chatService.userModerateChannel(
				req.user.id, login, channelName, resp);
		if (u.err)
			return;

		await this.chatService.setChannelUserBan(u.target.id, u.channel.id, false);
		resp.send({ message: 'user unbanned' });
	}

	@Put('/:channelName/kick/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Kick a user from a channel' })
	async kickUser(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Req() req: any, @Res() resp: Response)
	{
		const u: UserModerateChannel = await this.chatService.userModerateChannel(
				req.user.id, login, channelName, resp);
		if (u.err)
			return;

		await this.chatService.kickUserFromChannel(u.target.id, u.channel.id);
		resp.send({ message: 'user kicked' });
	}

	@Post('/:channelName/mute/:login/:duration')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Mute a user from a channel' })
	async muteUser(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Param('duration') duration: number,
					@Req() req: any, @Res() resp: Response)
	{
		const u: UserModerateChannel = await this.chatService.userModerateChannel(
			req.user.id, login, channelName, resp);
		if (u.err)
			return;

		const futur: Date = new Date(new Date().getTime() + (duration * 1000));
		await this.chatService.muteUserInChannel(u.target.id, u.channel.id, futur);
		resp.send({ message: `user muted for ${duration}` });
	}

	@Delete('/:channelName/mute/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Unmute a user from a channel' })
	async unmuteUser(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Req() req: any, @Res() resp: Response)
	{
		const u: UserModerateChannel = await this.chatService.userModerateChannel(
			req.user.id, login, channelName, resp);
		if (u.err)
			return;

		await this.chatService.muteUserInChannel(u.target.id, u.channel.id, new Date(0));
		resp.send({ message: 'user unmuted' });
	}
}

@ApiTags('channels')
@ApiCookieAuth()
@UseGuards(JwtGuard)
@Controller('channels')
export class ChannelsController {

	constructor(private readonly chatService: ChatService) {}

	@Get()
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Return existing channels list' })
	async getChannels() {
		const chans: Channel[] = await this.chatService.getChannels();
		return chans;
	}
}