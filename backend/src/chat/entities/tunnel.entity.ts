import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tunnels')
export class Tunnel {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ type: 'int', nullable: false })
	user1: number;

	@Column({ type: 'int', nullable: false })
	user2: number;

	@Column({ type: 'int', nullable: false, unique: true })
	tunnel_id: number;
}