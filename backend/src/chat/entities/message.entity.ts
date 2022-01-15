import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('direct_messages')
export class DirectMessage {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	// user: 
	// channel:

	announcement: boolean;

	content: string;

	// timestamp: 
}

@Entity('channel_messages')
export class ChannelMessage {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	// from: 
	// to:

	content: string;

	// timestamp:
}
