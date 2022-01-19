import { Controller, Delete, Get, UseGuards, Param,
		Put, Post, Header, Req, Res, Body } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { UserRole } from 'src/users/entities/roles.enum';

import { ChatService } from './chat.service';
import { Channel } from './entities/channel.entity';

import { CreateChannelDto } from './dto/createChannel.dto';
import { UpdateChannelNameDto } from './dto/updateChannelName.dto';
import { UpdateChannelPasswordDto } from './dto/updateChannelPassword.dto';
import { ModerationFlow } from './dto/moderationFlow.interface';
import { RequestError } from './dto/errors.enum';

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
			return resp.status(409).json({ error: RequestError.CHANNEL_ALREADY_EXIST });

		const obj: Channel = new Channel();
		obj.name = data.name;
		obj.password = data.password;
		obj.tunnel = false;
		obj.owner_id = req.user.id;
		obj.private = data.password.length > 0;

		const channel: Channel = await this.chatService.createChannel(obj);
		await this.chatService.addUserToChannel(req.user.id, channel.id, UserRole.ADMIN);
		resp.send({ "message": "channel created", "channel": channel });
	}

	@Get('/:channelName')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get channel informations' })
	async getChannel(@Param('channelName') channelName: string, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findChannelByName( channelName );
		if (!channel)
			return resp.status(404).json({ error: RequestError.CHANNEL_NOT_FOUND });

		resp.send(channel);
	}

	@Delete('/:channelName')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Delete a channel' })
	async deleteChannel(@Param('channelName') channelName: string,
						@Req() req: any, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findChannelByName(channelName);
		if (!channel)
			return resp.status(404).json({ error: RequestError.CHANNEL_NOT_FOUND });

		if (channel.owner_id !== req.user.id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		await this.chatService.deleteChannel( channel );
		resp.send({ message: 'channel deleted' });
	}

	@Get('/:channelName/messages')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get channel messages' })
	async getChannelMessages(@Param('channelName') channelName: string,
							@Req() req: any, @Res() resp: Response)						
	{
		const channel: Channel = await this.chatService.findChannelByName(channelName);
		if (!channel)
			return resp.status(404).json({ error: RequestError.CHANNEL_NOT_FOUND });

		const role: UserRole = await this.chatService.getUserRoleInChannel(req.user.id, channel.id);
		if (role === null || role === UserRole.BANNED)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		const messages = await this.chatService.getChannelMessages(req.user.id, channel.id);
		resp.send(messages);
	}

	@Get('/:channelName/users')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get channel users' })
	async getChannelUsers(@Param('channelName') channelName: string,
							@Req() req: any, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findChannelByName(channelName);
		if (!channel)
			return resp.status(404).json({ error: RequestError.CHANNEL_NOT_FOUND });

		const role: UserRole = await this.chatService.getUserRoleInChannel(req.user.id, channel.id);
		if (role === null || role === UserRole.BANNED)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		const users = await this.chatService.getChannelUsers(channel.id);
		resp.send(users);
	}

	/* PWD - OWNER ONLY*/
	@Post('/:channelName/name')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Update channel name' })
	async updateChannelName(@Param('channelName') channelName: string,
							@Body() data: UpdateChannelNameDto,
							@Req() req: any, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findChannelByName(channelName);
		if (!channel)
			return resp.status(404).json({ error: RequestError.CHANNEL_NOT_FOUND });

		if (channel.owner_id !== req.user_id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		await this.chatService.updateChannelName(channel, data.name);
		resp.send({ message: 'channel name updated' });
	}

	@Post('/:channelName/password')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Update channel password' })
	async updateChannelPassword(@Param('channelName') channelName: string,
								@Body() data: UpdateChannelPasswordDto,
								@Req() req: any, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findChannelByName(channelName);
		if (!channel)
			return resp.status(404).json({ error: RequestError.CHANNEL_NOT_FOUND });

		if (channel.owner_id !== req.user_id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

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
		const channel: Channel = await this.chatService.findChannelByName(channelName);
		if (!channel)
			return resp.status(404).json({ error: RequestError.CHANNEL_NOT_FOUND });

		if (channel.owner_id !== req.user_id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		await this.chatService.deleteChannelPassword( channel );
		resp.send({ message: 'channel password deleted' });
	}

	@Get('/:channelName/moderators')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get channel moderators' })
	async getChannelModerators(@Param('channelName') channelName: string,
								@Req() req: any, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findChannelByName(channelName);
		if (!channel)
			return resp.status(404).json({ error: RequestError.CHANNEL_NOT_FOUND });

		const role: UserRole = await this.chatService.getUserRoleInChannel(req.user.id, channel.id);
		if (role !== UserRole.MODERATOR && role !== UserRole.ADMIN)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		const moderators = await this.chatService.getChannelModerators(channel.id);
		resp.send(moderators);
	}

	/* MODERATOR MANAGEMENT - OWNER ONLY */
	@Put('/:channelName/moderator/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Add a user to moderator list' })
	async addUserToModeratorList(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Req() req: any, @Res() resp: Response)
	{
		const flow: ModerationFlow = await this.chatService.moderationFlow(
			req.user.id, login, channelName, resp);
		if (flow.err)
			return;

		if (flow.role !== UserRole.ADMIN && flow.channel.owner_id !== req.id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });
		
		await this.chatService.setUserChannelModerator(flow.channel.id, flow.target.id, true);
		resp.send({ message: 'user added to moderator list' });
	}

	@Delete('/:channelName/moderator/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Remove a user from moderator list' })
	async removeUserFromModeratorList(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Req() req: any, @Res() resp: Response)
	{
		const flow: ModerationFlow = await this.chatService.moderationFlow(
			req.user.id, login, channelName, resp);
		if (flow.err)
			return;

		if (flow.role !== UserRole.ADMIN && flow.channel.owner_id !== req.user.id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });
		
		await this.chatService.setUserChannelModerator(flow.channel.id, flow.target.id, false);
		resp.send({ message: 'user added to moderator list' });
	}

	/* BAN - KICK - MUTE - MODERATOR/ADMIN ONLY */
	@Put('/:channelName/ban/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Ban a user from a channel' })
	async banUser(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Req() req: any, @Res() resp: Response)
	{
		const flow: ModerationFlow = await this.chatService.moderationFlow(
			req.user.id, login, channelName, resp);
		if (flow.err)
			return;

		await this.chatService.setChannelUserBan(flow.target.id, flow.channel.id, false);
		resp.send({ message: 'user banned' });
	}

	@Delete('/:channelName/ban/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Unban a user from a channel' })
	async unbanUser(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Req() req: any, @Res() resp: Response)
	{
		const flow: ModerationFlow = await this.chatService.moderationFlow(
				req.user.id, login, channelName, resp);
		if (flow.err)
			return;

		await this.chatService.setChannelUserBan(flow.target.id, flow.channel.id, false);
		resp.send({ message: 'user unbanned' });
	}

	@Put('/:channelName/kick/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Kick a user from a channel' })
	async kickUser(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Req() req: any, @Res() resp: Response)
	{
		const flow: ModerationFlow = await this.chatService.moderationFlow(
				req.user.id, login, channelName, resp);
		if (flow.err)
			return;

		await this.chatService.kickUserFromChannel(flow.target.id, flow.channel.id);
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
		const flow: ModerationFlow = await this.chatService.moderationFlow(
			req.user.id, login, channelName, resp);
		if (flow.err)
			return;

		const futur: Date = new Date(new Date().getTime() + (duration * 1000));
		await this.chatService.muteUserInChannel(flow.target.id, flow.channel.id, futur);
		resp.send({ message: `user muted for ${duration}` });
	}

	@Delete('/:channelName/mute/:login')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Unmute a user from a channel' })
	async unmuteUser(@Param('channelName') channelName: string,
					@Param('login') login: string,
					@Req() req: any, @Res() resp: Response)
	{
		const flow: ModerationFlow = await this.chatService.moderationFlow(
			req.user.id, login, channelName, resp);
		if (flow.err)
			return;

		await this.chatService.muteUserInChannel(flow.target.id, flow.channel.id, new Date(0));
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