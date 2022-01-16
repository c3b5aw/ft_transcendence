import { Entity, PrimaryGeneratedColumn, 
		CreateDateColumn, Column } from 'typeorm';

@Entity('direct_messages')
export class DirectMessage {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ type: 'int', nullable: false })
	from_user_id: number;

	@Column({ type: 'int', nullable: false })
	to_user_id: number;

	content: string;

	@CreateDateColumn({ update: false, default: () => 'CURRENT_TIMESTAMP', nullable: false  })
	timestamp: Date;
}

@Entity('channel_messages')
export class ChannelMessage {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ type: 'int', nullable: false })
	user_id: number;

	@Column({ type: 'int', nullable: false })
	channel_id: number;

	@Column({ type: 'boolean', default: false, nullable: false })
	announcement: boolean;

	@Column({ type: 'text', nullable: false })
	content: string;

	@CreateDateColumn({ update: false, default: () => 'CURRENT_TIMESTAMP', nullable: false  })
	timestamp: Date;
}
