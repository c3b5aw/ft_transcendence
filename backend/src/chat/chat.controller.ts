import { Controller, Delete, Get, UseGuards, Param,
		Put, Post, Header, Req, Res, Body } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ChatService } from './chat.service';
import { Channel } from './entities/channel.entity';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateChannelDto } from './dto/createChannel.dto';

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
						@Req() req: any, @Res() resp: Response) {}

	@Get('/:name')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get channel informations' })
	async getChannel(@Param('name') name: string, @Res() resp: Response) {
		const channel: Channel = await this.chatService.findOneChannelByName( name );
		if (!channel)
			return resp.status(404).json({ error: 'channel not found' });

		resp.send(channel);
	}

	@Delete('/:name')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Delete a channel' })
	async deleteChannel(@Param('name') name: string,
						@Req() req: any, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findOneChannelByName(name);
		if (!channel)
			return resp.status(404).json({ error: 'channel not found' });

		if (channel.owner_id !== req.user.id)
			return resp.status(403).json({ error: 'you are not authorized to delete this channel' });

		await this.chatService.deleteChannel( channel );
		resp.send({ message: 'channel deleted' });
	}

	@Get('/:name/messages')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get channel messages' })
	async getChannelMessages(@Param('name') name: string,
							@Req() req: any, @Res() resp: Response)						
	{
		const channel: Channel = await this.chatService.findOneChannelByName(name);
		if (!channel)
			return resp.status(404).json({ error: 'channel not found' });

		const authorized: boolean = await this.chatService.isUserInChannel(req.user.id, channel.id);
		if (!authorized)
			return resp.status(403).json({ error: 'you have not joined this channel' });

		const messages = await this.chatService.getChannelMessages(channel.id);
		resp.send(messages);
	}

	/* PWD */
	@Post('/:name/password')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Update channel password' })
	async updateChannelPassword(@Param('name') name: string) {}

	@Delete('/:name/password')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Delete channel password' })
	async deleteChannelPassword(@Param('name') name: string,
								@Req() req: any, @Res() resp: Response)
	{
		const channel: Channel = await this.chatService.findOneChannelByName(name);
		if (!channel)
			return resp.status(404).json({ error: 'channel not found' });

		if (channel.owner_id !== req.user_id)
			return resp.status(403).json({ error: 'you are not authorized to delete this channel' });

		await this.chatService.deleteChannelPassword( channel );
		resp.send({ message: 'channel password deleted' });
	}

	/* BAN - KICK - MUTE */
	@Put('/:name/ban/:user')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Ban a user from a channel' })
	async banUser(@Param('name') name: string) {}

	@Delete('/:name/ban/:user')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Unban a user from a channel' })
	async unbanUser(@Param('name') name: string) {}

	@Put('/:name/kick/:user')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Kick a user from a channel' })
	async kickUser(@Param('name') name: string) {}

	@Post('/:name/mute')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Mute a user from a channel' })
	async muteUser(@Param('name') name: string) {}

	@Delete('/:name/mute')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Unmute a user from a channel' })
	async unmuteUser(@Param('name') name: string) {}

	/* MODERATOR */
	@Put('/:name/moderator/:user')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Add a user to moderator list' })
	async addUserToModeratorList(@Param('name') name: string) {}

	@Delete('/:name/moderator/:user')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Remove a user from moderator list' })
	async removeUserFromModeratorList(@Param('name') name: string) {}
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