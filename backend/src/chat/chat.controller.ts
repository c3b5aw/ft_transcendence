import { Controller, Delete, Get, UseGuards, Param,
		Put, Post, Header, Req, Res, Body } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { JwtTwoFactorGuard } from 'src/2fa/guards/2fa.guard';

import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/roles.enum';

import { ChatService } from './chat.service';
import { Channel } from './entities/channel.entity';

import { CreateChannelDto, CreateDirectChannelDto } from './dto/createChannel.dto';
import { UpdateChannelNameDto } from './dto/updateChannelName.dto';
import { UpdateChannelPasswordDto } from './dto/updateChannelPassword.dto';
import { ModerationFlow } from './dto/moderationFlow.interface';
import { RequestError } from './dto/errors.enum';

@ApiTags('channel')
@ApiCookieAuth()
@UseGuards(JwtTwoFactorGuard)
@Controller('channel')
export class ChannelController {

	constructor(private readonly chatService: ChatService) {}

	@Post()
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Create a channel' })
	async createChannel(@Body() data: CreateChannelDto,
						@Req() req: any, @Res() resp: Response)
	{
		if (data.name.startsWith('DM-'))
			return resp.status(400).json({ error: RequestError.INVALID_CHANNEL_NAME });

		const channel: Channel = await this.chatService.createChannel(req.user, data);
		if (!channel || channel === null)
			return resp.status(409).json({ error: RequestError.CHANNEL_ALREADY_EXIST });

		resp.send({ "message": "channel created", "channel": channel });
	}

	@Post('/dm')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Create a direct message channel' })
	async createDirectMessageChannel(@Body() data: CreateDirectChannelDto,
									 @Req() req: any, @Res() resp: Response)
	{
		const target: User = await this.chatService.getUser(data.login);
		if (!target || target === null)
			return resp.status(404).json({ error: RequestError.USER_NOT_FOUND });

		const channel: Channel = await this.chatService.createDirectChannel(req.user, target);
		if (!channel || channel === null)
			return resp.status(409).json({ error: RequestError.CHANNEL_ALREADY_EXIST });
		
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

		if ((channel.owner_id !== req.user.id && req.user.role !== UserRole.ADMIN))
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
	async getChannelUsers(@Param('channelName') channelName: string, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findChannelByName(channelName);
		if (!channel)
			return resp.status(404).json({ error: RequestError.CHANNEL_NOT_FOUND });

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

		if (channel.owner_id !== req.user.id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		const channelExist: Channel = await this.chatService.findChannelByName(data.name);
		if (channelExist)
			return resp.status(409).json({ error: RequestError.CHANNEL_ALREADY_EXIST });

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

		if (channel.owner_id !== req.user.id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		if (data.password.length === 0) {
			await this.chatService.deleteChannelPassword( channel );
			return resp.send({ message: 'channel password deleted' });
		}
		channel.password = data.password;

		await this.chatService.updateChannelPassword(channel);
		resp.send({ message: `#${channel.name} password updated` });
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

		if (channel.owner_id !== req.user.id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		await this.chatService.deleteChannelPassword( channel );
		resp.send({ message: `#${channel.name} password deleted` });
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

		if (flow.role !== UserRole.ADMIN || flow.channel.owner_id !== req.user.id || flow.target.id === flow.channel.owner_id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		await this.chatService.setUserChannelModerator(flow.target, flow.channel, true);
		resp.send({ message: `${flow.target.login} have been added in moderator list` });
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

		if (flow.role !== UserRole.ADMIN || flow.channel.owner_id !== req.user.id || flow.target.id === flow.channel.owner_id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });
		
		await this.chatService.setUserChannelModerator(flow.target, flow.channel, false);
		resp.send({ message: `${flow.target.login} have been removed from moderator list` });
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

		if (flow.target.id === flow.channel.owner_id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		await this.chatService.setChannelUserBan(flow.target, flow.channel, true);
		resp.send({ message: `${flow.target.login} has been banned` });
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

		if (flow.target.id === flow.channel.owner_id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		await this.chatService.setChannelUserBan(flow.target, flow.channel, false);
		resp.send({ message:  `${flow.target.login} has been unbanned` });
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

		if (flow.target.id === flow.channel.owner_id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		await this.chatService.kickUserFromChannel(flow.target, flow.channel);
		resp.send({ message:  `${flow.target.login} has been kicked` });
	}

	@Put('/:channelName/mute/:login/:duration')
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

		if (flow.target.id === flow.channel.owner_id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		const futur: Date = new Date(new Date().getTime() + (duration * 1000));
		await this.chatService.muteUserInChannel(flow.target, flow.channel, futur);
		resp.send({ message: `${flow.target.login} muted for ${duration} seconds` });
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

		if (flow.target.id === flow.channel.owner_id)
			return resp.status(403).json({ error: RequestError.NOT_ENOUGH_PERMISSIONS });

		await this.chatService.muteUserInChannel(flow.target, flow.channel, new Date(0));
		resp.send({ message: `${flow.target.login} has been unmuted` });
	}
}

@ApiTags('channels')
@ApiCookieAuth()
@UseGuards(JwtTwoFactorGuard)
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

	@Get('joined')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Return joined channels list' })
	async getJoinedChannels(@Req() req: any) {
		const chans: Channel[] = await this.chatService.getJoinedChannels(req.user.id);
		return chans;
	}
}