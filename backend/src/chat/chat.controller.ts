import { Controller, Delete, Get, UseGuards,
		Put, Post, Header } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ChatService } from './chat.service';
import { Channel } from './entities/channel.entity';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('channels')
@ApiCookieAuth()
@UseGuards(JwtGuard)
@Controller('channels')
export class ChannelController {
	@Post()
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Create a channel' })
	async createChannel() {}

	@Get('/:name')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get channel informations' })
	async getChannel() {}

	@Delete('/:name')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Delete a channel' })
	async deleteChannel() {}

	@Get('/:name/messages')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get channel messages' })
	async getChannelMessages() {}

	/* PWD */
	@Post('/:name/password')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Update channel password' })
	async updateChannelPassword() {}

	@Delete('/:name/password')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Delete channel password' })
	async deleteChannelPassword() {}

	/* BAN - KICK - MUTE */
	@Put('/:name/ban/:user')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Ban a user from a channel' })
	async banUser() {}

	@Delete('/:name/ban/:user')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Unban a user from a channel' })
	async unbanUser() {}

	@Put('/:name/kick/:user')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Kick a user from a channel' })
	async kickUser() {}

	@Post('/:name/mute')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Mute a user from a channel' })
	async muteUser() {}

	@Delete('/:name/mute')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Unmute a user from a channel' })
	async unmuteUser() {}

	/* MODERATOR */
	@Put('/:name/moderator/:user')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Add a user to moderator list' })
	async addUserToModeratorList() {}

	@Delete('/:name/moderator/:user')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Remove a user from moderator list' })
	async removeUserFromModeratorList() {}
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