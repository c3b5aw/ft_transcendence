import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ApiResponseProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { createWriteStream, fstat, writeFile } from 'fs';
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
		const writer = createWriteStream(`./uploads/${userDetails.id}.jpg`);

		axios.get(userDetails.avatar, { responseType: 'stream' })
        .then(response => {
            response.data.pipe(writer);
            writer.on('error', () => {
				throw new InternalServerErrorException();
			});
        })
        .catch(() => {
			throw new InternalServerErrorException();
        })
	
		return this.userRepository.save(userDetails);
	}

	async findOneByID(id: number) : Promise<User> {
		const user: User = await this.userRepository.findOne({ id });
		if (user) {
			delete user.login;
			delete user.email;
			delete user.two_factor_auth;
			delete user.two_factor_auth_secret;
		}
		return user;
	}

	async findMe(id: number) : Promise<User> {
		return this.userRepository.findOne({ id });
	}

	async updateLastLogin(user: User) : Promise<User> {
		user.lastLogin = new Date();
		return this.userRepository.save(user);
	}

	async findUsers() : Promise<User[]> {
		return this.userRepository.find({
			select: [
				'id',
				'display_name',
			]
		});
	}

	async getStatsByID(id: number) : Promise<User> {
		const user: User = await this.findOneByID(id);
		if (user)
			return 
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