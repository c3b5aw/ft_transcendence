import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChannelController, ChannelsController } from './chat.controller';

import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Channel, ChannelUser } from './entities/channel.entity';
import { ChatMessage } from './entities/message.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([ 
			ChatMessage,
			Channel, ChannelUser 
		]),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: {
				expiresIn: Number(process.env.JWT_EXPIRATION)
			} 
		}),
		UsersModule,
	],
	controllers: [ ChannelController, ChannelsController ],
	providers: [ ChatGateway, ChatService ],
	exports: []
})

export class ChatModule {}