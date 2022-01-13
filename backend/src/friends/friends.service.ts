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
<<<<<<< HEAD
=======
			.select('user_id', 'friend_id')
>>>>>>> origin/backend-login-rewrite
			.where('(user_id = :id OR friend_id = :id)', { id })
			.andWhere('status = :status', { status: FriendStatus.STATUS_ACCEPTED })
			.getMany();
	}

<<<<<<< HEAD
=======
	async findAllPendingById(id: number) : Promise<Friend[]> {
		return this.friendRepository.createQueryBuilder()
			.select('user_id', 'friend_id')
			.where('(user_id = :id OR friend_id = :id)', { id })
			.andWhere('status = :status', { status: FriendStatus.STATUS_PENDING })
			.getMany();
	}

>>>>>>> origin/backend-login-rewrite
	async findOneByBothId(uid: number, fid: number) : Promise<Friend> {
		return this.friendRepository.createQueryBuilder()
			.where('(user_id = :uid OR friend_id = :uid)', { uid })
			.andWhere('(user_id = :fid OR friend_id = :fid)', { fid })
			.getOne();
	}

<<<<<<< HEAD
=======
	async findOneAcceptedByBothId(uid: number, fid: number) : Promise<string> {
		const friendShip: Friend = await this.findOneByBothId(uid, fid);

		if (!friendShip)
			return 'not_friend';

		if (friendShip.status !== FriendStatus.STATUS_ACCEPTED)
			return 'not_accepted';

		return 'friend';
	}

	async addFriend(uid: number, fid: number) : Promise<string> {
		const friendShip: Friend = await this.findOneByBothId(uid, fid);

		if (friendShip)
			return 'already_friend';

		const newFriend: Friend = new Friend();
		newFriend.user_id = uid;
		newFriend.friend_id = fid;
		newFriend.status = FriendStatus.STATUS_PENDING;

		await this.friendRepository.save(newFriend);
		return 'friend_added';
	}

>>>>>>> origin/backend-login-rewrite
	async removeFriend(uid: number, fid: number) : Promise<boolean> {
		const friendShip: Friend = await this.findOneByBothId(uid, fid);

		if (!friendShip)
			return false;
		
		await this.friendRepository.delete(friendShip.id);
		return true;	
	}
}