import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

import { MatchType } from './types.enum';

@Entity('matchs')
export class Match {
	@PrimaryGeneratedColumn({ type: 'int' })
	@ApiProperty({ description: "match id (incremental)", example: 1 })
	id: number;

	/*
		MATCH DATA
	*/

	@Column({ type: 'varchar', length: 32, nullable: false, unique: true })
	@ApiProperty({ description: "match md5 hash", example: "hshf..." })
	hash: string;
	
	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: false })
	@ApiProperty({ description: "date started", example: "2020-01-01T00:00:00.000Z" })
	date: Date;

	@Column({ type: 'boolean', default: false })
	@ApiProperty({ description: "match finished", example: true })
	finished: boolean;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "duration in seconds", example: 20000 })
	duration: number;

	@Column({ type: 'enum', enum: MatchType, default: MatchType.MATCH_BOT, nullable: false })
	@ApiProperty({ description: "match type", example: MatchType.MATCH_BOT })
	type: MatchType;

	/*
		PLAYER 1
	*/

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "player 1 ID", example: 12 })
	player1: number;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "player 1 score", example: 64 })
	player1_score: number;

	/*
		PLAYER 2
	*/

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "player 2 ID", example: 13 })
	player2: number;

	@Column({ type: 'int', default: 0, nullable: false })
	@ApiProperty({ description: "player 2 score", example: 48 })
	player2_score: number;
}