import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('users_achievements')
export class UserAchievement {
	@PrimaryGeneratedColumn({ type: 'int' })
	id: number;

	@Column({ update: false, type: 'int', nullable: false })
	user_id: number;

	@Column({ update: false, type: 'int', nullable: false })
	achievement_id: number;

	@Column({ update: false, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false  })
	unlocked_at: Date;
}