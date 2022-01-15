import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('channels')
export class Channel {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	name: string;
	password: string;

	// users
	// messages
	// bans
	// muted
	// admins
	// owner
}