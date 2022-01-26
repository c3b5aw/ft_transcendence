import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';

import { WsGuard } from 'src/ws/guards/ws.guard';

import { UsersService } from 'src/users/users.service';

import { WSClient } from 'src/ws/datastructures/wsclient.struct';

@Injectable()
export class GameService {

	constructor(private readonly usersService: UsersService,
		private readonly jwtService: JwtService) {}

	server: Server;

	setServer(server: Server) {
		this.server = server;
	}

	async verifyUser(client: WSClient) {
		return WsGuard.verify(client, this.jwtService, this.usersService);
	}
}