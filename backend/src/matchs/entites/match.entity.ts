import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('matchs')
export class Match {
	@PrimaryGeneratedColumn({ type: 'int' })
	@ApiProperty({ description: "match id (incremental)", example: 1 })
	id: number;

	@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
	@ApiProperty({ description: "match date", example: "2020-01-01T00:00:00.000Z" })
	date: Date;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "match duration in seconds", example: 20000 })
	duration: number;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "match player 1", example: 12 })
	player_1: number;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "match player 2", example: 13 })
	player_2: number;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "match player 1 score", example: 64 })
	player_1_score: number;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "match player 2 score", example: 48 })
	player_2_score: number;
}