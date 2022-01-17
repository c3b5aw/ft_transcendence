import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChatService {

	constructor(
		@InjectRepository(Channel) private readonly channelsRepository: Repository<Channel>,
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
	) {
		global.clients = {};
	}

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
		const userID = global.clients[client.id];
		return userID ? parseInt(userID) : null;
	}

	async getChannels(): Promise<Channel[]> {
		return this.channelsRepository.find({
			where: {
				tunnel: false,
			},
			select: ['id', 'name', 'private'],
		});
	}
}