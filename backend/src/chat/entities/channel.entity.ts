import { Entity, PrimaryGeneratedColumn,
		CreateDateColumn, Column } from 'typeorm';

@Entity('channels')
export class Channel {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ type: 'varchar', length: 64, unique: true, nullable: false })
	name: string;

	@Column({ type: 'varchar', length: 64, nullable: true })
	password: string;

	@Column({ type: 'int', nullable: false })
	owner_id: number;
}

@Entity('channels_users')
export class ChannelUser {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ type: 'boolean', default: false, nullable: false })
	admin: boolean;

	@Column({ type: 'boolean', default: false, nullable: false })
	banned: boolean;

	@Column({ type: 'boolean', default: false, nullable: false })
	muted: boolean;

	@CreateDateColumn({ update: false, default: () => 'CURRENT_TIMESTAMP', nullable: false  })
	muted_until: Date;

	@Column({ type: 'int', nullable: false })
	channel_id: number;

	@Column({ type: 'int', nullable: false })
	user_id: number;
}