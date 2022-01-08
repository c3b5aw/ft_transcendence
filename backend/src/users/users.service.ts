import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	/*
		view https://docs.nestjs.com/techniques/database#custom-repository
	*/
	constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

	async createUser(userDetails: User) : Promise<User> {
		const user = this.userRepository.create( userDetails );

		return this.userRepository.save(user);
	}

	async findOneByLogin(login: string) : Promise<User> {
		return this.userRepository.findOne({ login });
	}

	async findOneByID(id: number) : Promise<User> {
		return this.userRepository.findOne({ id });
	}
}