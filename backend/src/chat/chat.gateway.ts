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

	// @Get('/channels) -- Return all channels
	// @Post('/channel') -- Create channel
	// -- db + will send EVENT.{name}.newChannel
	// @Delete('/channel/:{name}') -- Delete channel
	// -- db + will send EVENT.{name}.channelUpdated + disconnect all users from channel
	// @Post('/channel/:{name}/password) -- Update channel password
	// -- db + will send EVENT.{name}.channelUpdated + disconnect all from channel forcing to rejoin
	// @Delete('/channel/:{name}/password) -- Delete channel password
	// -- db + will send EVENT.{name}.channelUpdated
	// @Post('/channel/:{name}/mute/:{userID}') -- Mute user -- includes time
	// -- db + will send EVENT.{name}.userID.you_have_been_muted
	// @Delete('/channel/:{name}/mute/:{userID}') -- Unmute user
	// -- db + will send EVENT.{name}.userID.you_have_been_unmuted
	// @Post('/channel/:{name}/ban/:{userID}') -- Ban user
	// -- db + will send EVENT.{name}.userID.you_have_been_banned
	// @Delete('/channel/:{name}/ban/:{userID}') -- Unban user
	// -- db + will send EVENT.{name}.userID.you_have_been_unbanned
	// @Post('/channel/:{name}/admin/:{userID}') -- Add user to admin list
	// -- db + will send EVENT.{name}.userID.you_have_been_added_to_admin_list
	// @Delete('/channel/:{name}/admin/:{userID}') -- Remove user from admin list
	// -- db + will send EVENT.{name}.userID.you_have_been_removed_from_admin_list

	// @SubscribeMessage('joinChannel') -- May Include password
	//		-> Return success or fail + old messages
	//		-> save in db + send back to everyone in channel
	// @SubscribeMessage('leaveChannel')
	//		-> save in db + send back to everyone in channel

	// @SubscribeMessage('sendMessageToUser')
	//		-> save in db + send back to user who sent message
	// @SubscribeMessage('sendMessageToChannel')
}