import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity('users')
export class User {
	@PrimaryGeneratedColumn({ type: 'int' })
	@ApiProperty({ description: "user id (incremental)", example: 1 })
	id: number;

	/*
		USER DATA
	*/
	@Column({ type: 'varchar', length: 64, unique: true, update: false, nullable: false })
	@ApiProperty({ description: "user login from 42 intra", example: "intra42" })
	login: string;

	@Column({ type: 'varchar', length: 64, unique: true, nullable: false })
	@ApiProperty({ description: "user nickname", example: "c3b5aw" })
	nickname: string;

	@Column({ type: 'varchar', length: 64, unique: true, update: false })
	@ApiProperty({ description: "user email", example: "user@student.42.fr" })
	email: string;

	@Column({ type: 'varchar', length: 64, unique: true })
	@ApiProperty({ description: "user avatar filename", example: "avatar.png" })
	avatar: string;

	/*
		2FA
	*/

	@Column({ type: 'boolean', default: false })
	@ApiProperty({ description: "2FA enabled", example: true })
	twoFactorAuth: boolean;

	@Column({ type: 'varchar', length: 64, unique: true, nullable: true })
	@ApiProperty({ description: "2FA secret", example: "--secret--" })
	twoFactorAuthSecret: string;

	/*
		MATCH STATS
	*/

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

	/*
		FRIENDS
	*/

	// @Column({ type: 'int', default: 0 })
	// @ApiProperty({ description: "user friends ids", example: [1, 2, 3] })
	// friends: number[];

	@Column({ type: 'boolean', default: false })
	@ApiProperty({ description: "is online", example: true })
	connected: boolean;

	@CreateDateColumn({ update: false })
	@ApiProperty({ description: "user register date", example: "2020-01-01T00:00:00.000Z" })
	created: Date;

	@CreateDateColumn({ update: true })
	@ApiProperty({ description: "user last login date", example: "2020-01-01T00:00:00.000Z" })
	lastLogin: Date;
}