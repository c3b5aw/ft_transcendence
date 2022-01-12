import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Friend } from './entities/friend.entity';
import { FriendStatus } from './entities/status.enum';

@Injectable()
export class FriendsService {

	constructor(@InjectRepository(Friend) private readonly friendRepository: Repository<Friend>) {}

	async findAllAcceptedByID(id: number) : Promise<Friend[]> {
		return this.friendRepository.createQueryBuilder()
			.where('(user_id = :id OR friend_id = :id)', { id })
			.andWhere('status = :status', { status: FriendStatus.STATUS_ACCEPTED })
			.getMany();
	}

	async removeFriend(uid: number, fid: number) : Promise<boolean> {
		return false;	
	}
}