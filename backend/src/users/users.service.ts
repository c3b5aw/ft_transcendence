import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Response } from 'express';
import { createWriteStream } from 'fs';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { UserStats } from './dto/stats.dto';
import { UserInterface } from './interfaces/user.interface';
import { createHash } from 'crypto';

@Injectable()
export class UsersService {
	/*
		view https://docs.nestjs.com/techniques/database#custom-repository
	*/
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	async createUser(userDetails: UserInterface) : Promise<User> {
		const writer = createWriteStream( `./public/avatars/${userDetails.id}.jpg` )
			.on('error', (err) => {
				if (err)
					console.log(err);
			})

		const hash = createHash('md5').update(userDetails.email).digest('hex');

		axios.get('https://www.gravatar.com/avatar/' + hash + '?s=200&d=retro', 
			{ responseType: 'stream' })
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

	/*
		FINDER
	
		- findOneByID
		- findMe
		- findUsers
		- findOneByDisplayName
		- findOneByLogin
	*/

	async findOneByID(id: number) : Promise<User> {
		const user: User = await this.userRepository.findOne({ id });
		if (user) {
			delete user.email;
			delete user.two_factor_auth;
			delete user.two_factor_auth_secret;
		}
		return user;
	}

	async findMe(id: number) : Promise<User> {
		return this.userRepository.findOne({ id });
	}

	async findAll() : Promise<User[]> {
		return this.userRepository.find({ select: [ 'id', 'login' ] });
	}

	async findOneByLogin(login: string) : Promise<User> {
		const user: User = await this.userRepository.findOne({ login });
		if (user) {
			delete user.email;
			delete user.two_factor_auth;
			delete user.two_factor_auth_secret;
		}
		return user;
	}

	async findOneByDisplayName(displayName: string) : Promise<User> {
		return this.userRepository.findOne({ display_name: displayName });
	}

	/*
		UPDATER

		- updateLastLogin
		- updateDisplayName
	*/

	async updateUserBan(id: number, banned: boolean) : Promise<any> {
		return this.userRepository.update({ id: id }, { banned: banned });
	}

	async updateLastLogin(user: User) : Promise<User> {
		user.lastLogin = new Date();
		return this.userRepository.save(user);
	}

	async updateDisplayName(uid: number, displayName: string): Promise<any> {
		return this.userRepository.update({ id: uid }, { display_name: displayName });
	}

	/*
		GETTER

		- getStatsByID
		- getLadder
	*/

	async getStatsById(id: number) : Promise<UserStats> {
		const user: User = await this.userRepository.findOne({ id });
		if (!user) {
			return undefined;
		}

		return this.userRepository.manager.query(
			`SELECT id, login, rank::INTEGER, elo, played, victories, defeats FROM (`
			+ `SELECT *, ROW_NUMBER() OVER (ORDER BY elo DESC) AS rank FROM users`
			+ `) u WHERE u.id = ${id}`
		);
	}

	async getLadder() : Promise<User[]> {
		return this.userRepository.find({
			select: [
				'id', 'login', 'display_name',
				'elo', 'played', 'victories', 'defeats'
			],
			order: { elo: 'DESC' },
		});
	}

	async countAll() : Promise<number> {
		return this.userRepository.count();
	}

	/*
		SENDER
	*/

	async sendAvatar(id: number, resp: Response) {
		resp.sendFile( `${id}.jpg`, { root: './public/avatars' }, (err) => {
			if (err) {
				resp.sendFile( `default.jpg`, { root: './public/avatars'}, (err_fallback) => {
					if (err_fallback) {
						resp.header('Content-Type', 'application/json');
						resp.status(404).json({
							error: 'file not found',
						});
					}
				})
			}
		});
	}
}