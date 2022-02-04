import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Friend } from './entities/friend.entity';
import { FriendStatus } from './entities/status.enum';

@Injectable()
export class FriendsService {

	constructor(@InjectRepository(Friend) private readonly friendRepository: Repository<Friend>) {}

	async findAllByStatus(id: number, status: FriendStatus) : Promise<Friend[]> {
		return this.friendRepository.query(`
			SELECT query.*, users.login, users.status FROM (
				SELECT friends.status,
					CASE
						WHEN user_id = ${id} THEN friend_id
						ELSE user_id
					END AS id
				FROM friends
				WHERE (user_id = ${id} OR friend_id = ${id})
					AND status = '${status}'
			) AS query
			INNER JOIN users ON query.id = users.id
		`);
	}

	async findAllAcceptedById(id: number) : Promise<Friend[]> {
		return this.findAllByStatus(id, FriendStatus.STATUS_ACCEPTED);
	}

	async findAllPendingById(id: number) : Promise<Friend[]> {
		return this.friendRepository.query(`
			SELECT users.login, query.user_id, query.status FROM (
				SELECT *
				FROM friends
				WHERE friend_id = ${id} AND status = 'PENDING'
			) AS query
			INNER JOIN users on query.user_id = users.id
		`);
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
		newFriend.friend_id = fid;
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

	async updateBlocked(me: number, him: number, blocked: boolean) : Promise<string> {
		const friendShip: Friend = await this.findOneByBothId(me, him);
		if (!friendShip)
			return 'friendship not found';

		if (blocked) {
			if (friendShip.status === FriendStatus.STATUS_BLOCKED)
				return 'you are already blocked';
			friendShip.status = FriendStatus.STATUS_BLOCKED;
			/*
				We put the user who blocked the other in user_id field so we can
				easily find the initiator in the database and prevent unblocking from
				the wrong user.
			*/
			if (friendShip.user_id != me) {
				friendShip.friend_id = him;
				friendShip.user_id = me;
			}
		} else {
			if (friendShip.user_id != me)
				return 'you are blocked';
			friendShip.status = FriendStatus.STATUS_PENDING;
		}
		
		await this.friendRepository.save(friendShip);
		
		return null;
	}
}