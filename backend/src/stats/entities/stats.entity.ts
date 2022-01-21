import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users_stats')
export class UserStats {
	@PrimaryColumn({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "user id", example: 1 })
	id: number;

	@Column({ type: 'int', default: 1200 })
	@ApiProperty({ description: "user elo", example: 1248 })
	elo: number;

	@Column({ type: 'int', default: 0 })
	@ApiProperty({ description: "user total match played", example: 12 })
	played: number;

	@Column({ type: 'int', default: 0 })
	@ApiProperty({ description: "user total match won", example: 4 })
	victories: number;

	@Column({ type: 'int', default: 0 })
	@ApiProperty({ description: "user total match lost", example: 8 })
	defeats: number;
}