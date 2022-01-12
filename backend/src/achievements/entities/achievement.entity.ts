import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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