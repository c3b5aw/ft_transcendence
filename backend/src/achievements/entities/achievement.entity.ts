import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('achievements')
export class Achievement {

	@PrimaryGeneratedColumn({ type: 'int' })
	@ApiProperty({ description: "achievement id (incremental)", example: 1 })
	id: number;

	@Column({ type: 'varchar', length: 32, nullable: false })
	@ApiProperty({ description: "achievement name", example: "First Match" })
	name: string;

	@Column({ type: 'text', nullable: false })
	@ApiProperty({ description: "achievement description", example: "You have won the first match" })
	description: string;

	@Column({ type: 'int', nullable: false, default: 1 })
	@ApiProperty({ description: "achievements points", example: 100 })
	points: Number;
}

@Entity('users_achievements')
export class UserAchievement {
	@PrimaryGeneratedColumn({ type: 'int' })
	@ApiProperty({ description: "user achievement id (incremental)", example: 1 })
	id: number;

	@Column({ type: 'int', update: false, nullable: false })
	@ApiProperty({ description: "user id", example: 1 })
	user_id: number;

	@Column({ type: 'int', update: false, nullable: false })
	@ApiProperty({ description: "achievement id", example: 1 })
	achievement_id: number;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', update: false, nullable: false  })
	@ApiProperty({ description: "unlocked at", example: "2020-01-01T00:00:00.000Z" })
	unlocked_at: Date;
}