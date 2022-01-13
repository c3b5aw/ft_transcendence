import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { FriendStatus } from './status.enum';

@Entity('friends')
export class Friend {

	@PrimaryGeneratedColumn({ type: 'int' })
	@ApiProperty({ description: "friend id (incremental)", example: 1 })
	id: number;

	@Column({ type: 'int', nullable: false })
	@ApiProperty({ description: "user id", example: 83791 })
	user_id: number;

	@Column({ type: 'varchar', length: 64, nullable: false })
	@ApiProperty({ description: "user login", example: "intra42" })
	user_login: string;

	@Column({ type: 'int', nullable: false })
	@ApiProperty({ description: "friend id", example: 83121 })
	friend_id: number;

	@Column({ type: 'varchar', length: 64, nullable: false })
	@ApiProperty({ description: "friend login", example: "intra42" })
	friend_login: string;

	@Column({ type: 'enum', enum: FriendStatus, 
			default: FriendStatus.STATUS_PENDING, nullable: false })
	@ApiProperty({ description: "friend status", example: "PENDING" })
	status: FriendStatus;
}