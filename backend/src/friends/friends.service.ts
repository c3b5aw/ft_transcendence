import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Friend } from './entities/friend.entity';
import { FriendStatus } from './entities/status.enum';

@Injectable()
export class FriendsService {

	constructor(@InjectRepository(Friend) private readonly friendRepository: Repository<Friend>) {}

	async findAllAcceptedById(id: number) : Promise<Friend[]> {
		return this.friendRepository.createQueryBuilder()
			.where('(user_id = :id OR friend_id = :id)', { id })
			.andWhere('status = :status', { status: FriendStatus.STATUS_ACCEPTED })
			.getMany();
	}

	async findOneByBothId(uid: number, fid: number) : Promise<Friend> {
		return this.friendRepository.createQueryBuilder()
			.where('(user_id = :uid OR friend_id = :uid)', { uid })
			.andWhere('(user_id = :fid OR friend_id = :fid)', { fid })
			.getOne();
	}

	async removeFriend(uid: number, fid: number) : Promise<boolean> {
		const friendShip: Friend = await this.findOneByBothId(uid, fid);

		if (!friendShip)
			return false;
		
		await this.friendRepository.delete(friendShip.id);
		return true;	
	}
}