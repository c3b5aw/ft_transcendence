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

	async findAllPendingById(id: number) : Promise<Friend[]> {
		return this.friendRepository.createQueryBuilder()
			.where('(user_id = :id OR friend_id = :id)', { id })
			.andWhere('status = :status', { status: FriendStatus.STATUS_PENDING })
			.getMany();
	}

	async findOneByBothId(uid: number, fid: number) : Promise<Friend> {
		return this.friendRepository.createQueryBuilder()
			.where('(user_id = :uid OR friend_id = :uid)', { uid })
			.andWhere('(user_id = :fid OR friend_id = :fid)', { fid })
			.getOne();
	}

	async findOnePendingByBothId(uid: number, fid: number) : Promise<Friend> {
		return this.friendRepository.createQueryBuilder()
			.where('(user_id = :uid OR friend_id = :uid)', { uid })
			.andWhere('(user_id = :fid OR friend_id = :fid)', { fid })
			.andWhere('status = :status', { status: FriendStatus.STATUS_PENDING })
			.getOne();
	}

	async addFriend(uid: number, ulogin: string, fid: number, flogin: string) : Promise<string> {
		const friendShip: Friend = await this.findOneByBothId(uid, fid);

		if (friendShip)
			return 'already_friend';

		const newFriend: Friend = new Friend();
		newFriend.user_id = uid;
		newFriend.user_login = ulogin;
		newFriend.friend_id = fid;
		newFriend.friend_login = flogin;
		newFriend.status = FriendStatus.STATUS_PENDING;

		await this.friendRepository.save(newFriend);
		return 'friend_added';
	}

	async acceptFriend(id: number) : Promise<boolean> {
		const friendShip: Friend = await this.friendRepository.findOne(id);

		if (!friendShip)
			return false;

		friendShip.status = FriendStatus.STATUS_ACCEPTED;
		await this.friendRepository.save(friendShip);
		return true;
	}

	async removeFriend(uid: number, fid: number) : Promise<boolean> {
		const friendShip: Friend = await this.findOneByBothId(uid, fid);

		if (!friendShip)
			return false;
		
		await this.friendRepository.delete(friendShip.id);
		return true;	
	}
}