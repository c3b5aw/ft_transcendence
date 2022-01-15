import { WebSocketGateway, WebSocketServer, SubscribeMessage, 
		MessageBody, ConnectedSocket, OnGatewayConnection,
		OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({  namespace: '/chat', cors: { origin: '*' }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private logger: Logger = new Logger('ChatGateway');

	constructor(private readonly jwtService: JwtService,
				private readonly usersService: UsersService) {}

	afterInit() {
		this.logger.log('ChatGateway initialized');
	}

	async handleConnection( client: Socket ) {

		/* Find cookie */
		if ( !client.handshake.headers.hasOwnProperty('cookie')
			|| !client.handshake.headers.cookie)
			return client.disconnect();

		const cookies = client.handshake.headers.cookie;
		const cookie = cookies.split(';').find( c => c.trim().startsWith('access_token='));
		if (!cookie)
			return client.disconnect();

		/* Verify token from cookie */
		const accessToken = cookie.split('=')[1];
		const payload = this.jwtService.verify(accessToken, {
			ignoreExpiration: false,
		});

		/* Find user */
		
		const user: User = await this.usersService.findOneByID( payload.sub );
		if (!user || user.banned)
			return client.disconnect();
		
		/* Set user connected */
		// user -> logIn + set Connected

		this.logger.log(`Client ${client.id} connected`);
	}

	handleDisconnect( client: Socket ) {
		// set user disconnected
		this.logger.log(`Client ${client.id} disconnected`);
	}

}