import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UsersService {
	/*
		view https://docs.nestjs.com/techniques/database#custom-repository
	*/
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	async createUser(userDetails: UserInterface) : Promise<User> {
		const user = this.userRepository.create( userDetails );

		return this.userRepository.save(user);
	}

	async findOneByID(id: number) : Promise<User> {
		return this.userRepository.findOne({ id });
	}

	async updateLastLogin(user: User) : Promise<User> {
		user.lastLogin = new Date();
		return this.userRepository.save(user);
	}

	async findUsers() : Promise<User[]> {
		return this.userRepository.find();
	}

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