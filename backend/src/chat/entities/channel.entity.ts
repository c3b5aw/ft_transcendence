import { Entity, PrimaryGeneratedColumn,
		CreateDateColumn, Column } from 'typeorm';

import { UserRole } from 'src/users/entities/roles.enum';

@Entity('channels')
export class Channel {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ type: 'varchar', length: 64, unique: true, nullable: false })
	name: string;

	@Column({ type: 'varchar', length: 32, nullable: true, default: null })
	password: string;

	@Column({ type: 'boolean', default: false, nullable: false })
	tunnel: boolean;

	@Column({ type: 'boolean', default: false, nullable: false })
	private: boolean;

	@Column({ type: 'int', nullable: false })
	owner_id: number;
}

@Entity('channels_users')
export class ChannelUser {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER, nullable: false })
	role: UserRole;

	@CreateDateColumn({ update: false, default: 0, nullable: false  })
	muted: Date;

	@Column({ type: 'int', nullable: false })
	channel_id: number;

	@Column({ type: 'int', nullable: false })
	user_id: number;
}