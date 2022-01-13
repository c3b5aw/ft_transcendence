import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('users_achievements')
export class UserAchievement {
	@PrimaryGeneratedColumn({ type: 'int' })
	@ApiProperty({ description: "user achievement id (incremental)", example: 1 })
	id: number;

	@Column({ type: 'int', update: false, nullable: false })
	@ApiProperty({ description: "user id", example: 1 })
	user_id: number;

	@Column({ type: 'varchar', length: 64, nullable: false })
	@ApiProperty({ description: "user login", example: "intra42" })
	user_login: string;

	@Column({ type: 'int', update: false, nullable: false })
	@ApiProperty({ description: "achievement id", example: 1 })
	achievement_id: number;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', update: false, nullable: false  })
	@ApiProperty({ description: "unlocked at", example: "2020-01-01T00:00:00.000Z" })
	unlocked_at: Date;
}