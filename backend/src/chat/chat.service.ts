import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Channel, ChannelUser } from './entities/channel.entity';
import { ChatMessage } from './entities/message.entity';

@Injectable()
export class ChatService {

	constructor(
		@InjectRepository(Channel) 
		private readonly channelsRepository: Repository<Channel>,
		
		@InjectRepository(ChannelUser)
		private readonly userChannelRepository: Repository<ChannelUser>,

		@InjectRepository(ChatMessage)
		private readonly messagesRepository: Repository<ChatMessage>,

		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
	) {
		global.clients = {};
	}

	/*
		LOG IN/OUT FLOW
	*/

	async wsLogin(client: Socket): Promise<boolean> {
		/* Find cookie */
		if ( !client.handshake.headers.hasOwnProperty('cookie')
		|| !client.handshake.headers.cookie)
			return false;

		const cookies = client.handshake.headers.cookie;
		const cookie = cookies.split(';').find( c => c.trim().startsWith('access_token='));
		if (!cookie)
			return false;

		/* Verify token from cookie */
		const accessToken = cookie.split('=')[1];
		const payload = this.jwtService.verify(accessToken, {
			ignoreExpiration: false,
		});

		/* Get User from DB */
		const user: User = await this.usersService.findOneByID( payload.sub );
		if (!user || user.banned)
			return false;

		/* Update user connected */
		await this.usersService.updateUserConnect(user, true);

		/* Add client to global clients */
		global.clients[client.id] = user.id;

		return true;
	}

	async wsLogout(client: Socket) {
		/* Resolve userID by socketID */
		const userID: number = await this.getUserIdBySocket(client);
		if (!userID)
			return;

		const user: User = await this.usersService.findOneByID(userID);

		/* Update user connected */
		await this.usersService.updateUserConnect(user, false);

		/* Remove client from global clients */
		delete global.clients[client.id];
	}

	/*
		GETTERS
	*/

	async getUserIdBySocket(client: Socket): Promise<number> {
		/*
			Resolve userID using global clients variable shared 
				accross all instances of chatServices
		*/
		const userID = global.clients[client.id];
		return userID ? parseInt(userID) : null;
	}

	async getChannels(): Promise<Channel[]> {
		return this.channelsRepository.find({
			where: { tunnel: false },
			select: [ 'id', 'name', 'private' ],
		});
	}

	async getChannelMessages(channelID: number): Promise<any> {
		// ToDo: manage blocked users in messages using nested select + not IN
		return this.messagesRepository.find({
			where: { channel_id: channelID },
		});
	}

	/*
		FINDER
	*/

	async findOneChannelByName(name: string): Promise<Channel> {
		return this.channelsRepository.findOne({
			where: { name: name },
			select: [ 'id', 'name', 'private', 'tunnel' ],
		});
	}

	/*
		DELETER
	*/

	async deleteChannel(channel: Channel): Promise<void> {
		await this.channelsRepository.delete(channel);
	}

	async deleteChannelPassword(channel: Channel): Promise<void> {
		await this.channelsRepository.update(channel.id, {
				password: null, private: false,
		});
	}

	/*
		BOOL
	*/
	
	async isUserInChannel(userID: number, channelID: number): Promise<boolean> {
		const user = await this.userChannelRepository.findOne({
			where: { user_id: userID, channel_id: channelID },
		});

		if (!user || user.banned)
			return false;
		return true;
	}
}