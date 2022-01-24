import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from './roles.enum';
import { UserStatus } from './status.enum';

@Entity('users')
export class User {
	@PrimaryColumn({ type: 'int', unique: true, update: false, nullable: false })
	@ApiProperty({ description: "user id (incremental - from 42API)", example: 1 })
	id: number;

	/*
		USER DATA
	*/

	@Column({ type: 'varchar', length: 64, unique: true, update: false, nullable: false })
	@ApiProperty({ description: "user login from 42 intra", example: "intra42" })
	login: string;

	@Column({ type: 'varchar', length: 64, unique: true, nullable: false })
	@ApiProperty({ description: "user displayed name", example: "John doe" })
	display_name: string;

	@Column({ type: 'varchar', length: 64, unique: true, update: false })
	@ApiProperty({ description: "user email", example: "user@student.42.fr" })
	email: string;


	@Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER, nullable: false })
	@ApiProperty({ description: "user role", example: "MEMBER" })
	role: UserRole;

	/*
		2FA
	*/

	@Column({ type: 'boolean', default: false })
	@ApiProperty({ description: "2FA enabled", example: true })
	two_factor_auth: boolean;

	@Column({ type: 'varchar', length: 64, unique: true, nullable: true })
	@ApiProperty({ description: "2FA secret", example: "--secret--" })
	two_factor_auth_secret: string;

	/*
		USER INFOS
	*/

	@Column({ type: 'enum', enum: UserStatus, default: UserStatus.OFFLINE })
	@ApiProperty({ description: "user connection status", example: "CONNECTED" })
	status: UserStatus;

	@CreateDateColumn({ update: false, default: () => 'CURRENT_TIMESTAMP', nullable: false  })
	@ApiProperty({ description: "user register date", example: "2020-01-01T00:00:00.000Z" })
	created: Date;

	@CreateDateColumn({ update: true, default: () => 'CURRENT_TIMESTAMP', nullable: false  })
	@ApiProperty({ description: "user last login date", example: "2020-01-01T00:00:00.000Z" })
	last_login: Date;
}