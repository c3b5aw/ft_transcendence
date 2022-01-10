import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LadderService {

	constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

	async getLadder() : Promise<User[]> {
		return this.userRepository.find({
			select: [
				'id',
				'display_name',
				'elo',
				'played',
				'victories',
				'defeats'
			],
			order: {
				elo: 'DESC',
			},
		});
	}
}