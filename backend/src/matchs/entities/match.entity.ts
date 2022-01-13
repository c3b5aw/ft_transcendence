import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('matchs')
export class Match {
	@PrimaryGeneratedColumn({ type: 'int' })
	@ApiProperty({ description: "match id (incremental)", example: 1 })
	id: number;

	/*
		MATCH DATA
	*/

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
	@ApiProperty({ description: "date started", example: "2020-01-01T00:00:00.000Z" })
	date: Date;

	@Column({ type: 'boolean', default: false })
	@ApiProperty({ description: "match finished", example: true })
	finished: boolean;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "duration in seconds", example: 20000 })
	duration: number;

	/*
		PLAYER 1
	*/

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "player 1 ID", example: 12 })
	player_1_id: number;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "player 1 login", example: "intra42" })
	player_1_login: number;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "player 1 score", example: 64 })
	player_1_score: number;

	/*
		PLAYER 2
	*/

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "player 2 ID", example: 13 })
	player_2_id: number;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "player 2 login", example: "intra42" })
	player_2_login: number;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "player 2 score", example: 48 })
	player_2_score: number;
}