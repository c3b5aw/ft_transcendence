import { Entity, PrimaryGeneratedColumn, 
		CreateDateColumn, Column } from 'typeorm';

@Entity('chat_messages')
export class ChatMessage {
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
