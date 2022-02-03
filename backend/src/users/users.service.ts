import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Response } from 'express';
import { createWriteStream } from 'fs';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';

import { User } from './entities/user.entity';
import { UserInterface } from './interfaces/user.interface';
import { UserRole } from './entities/roles.enum';
import { UserStatus } from './entities/status.enum';
import { StatsService } from 'src/stats/stats.service';

@Injectable()
export class UsersService {
	private logger: Logger = new Logger('UsersService');
	
	/*
		view https://docs.nestjs.com/techniques/database#custom-repository
	*/
	constructor(@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		
		private readonly statsService: StatsService) {}

	async createUser(userDetails: UserInterface) : Promise<User> {
		const writer = createWriteStream( `./public/avatars/${userDetails.id}.jpg` )
			.on('error', (err) => {
				if (err)
					this.logger.error(err);
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
	
		const user: User = await this.userRepository.save(userDetails);
		await this.statsService.createUserStats(user.id);
		return user;
	}

	/*
		FINDER
	
		- findOneByID
		- findMe
		- findUsers
		- findOneByDisplayName
		- findOneByLogin
	*/

	async findOneByIDWithCreds(id: number) : Promise<User> {
		return this.userRepository.findOne({ id });
	}

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
		const user: User = await this.userRepository.findOne({ id });
		if (user) {
			delete user.two_factor_auth_secret;
		}
		return user;
	}

	async findAll(adminRights: boolean) : Promise<User[]> {
		if (!adminRights)
			return this.userRepository.find({ select: [ 'id', 'login' ] });
		return this.userRepository.find();
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

	async updateStatus(id: number, status: UserStatus) {
		return this.userRepository.update({ id: id }, { status: status });
	}

	async updateUserBan(id: number, banned: boolean) : Promise<any> {
		return this.userRepository.update({ id: id }, 
			{ role: banned ? UserRole.BANNED : UserRole.MEMBER });
	}

	async updateLastLogin(user: User) : Promise<User> {
		user.last_login = new Date();
		return this.userRepository.save(user);
	}

	async updateUserConnect(user: User, state: UserStatus): Promise<User> {
		user.status = state;
		if (state === UserStatus.ONLINE)
			user.last_login = new Date();
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

	async getStatsById(id: number) {
		const stats = await this.userRepository.query(`
			SELECT * FROM (
				SELECT users.id, users.login, users.status, users.last_login, users.role,
				stats.elo, stats.played, stats.victories, stats.defeats,
				ROW_NUMBER() over (ORDER BY stats.elo DESC, stats.victories DESC) as rank
				FROM users
				LEFT JOIN users_stats
					AS stats
					ON stats.id = users.id
				ORDER BY stats.elo DESC, stats.victories DESC
			) usr WHERE usr.id = ${id};
		`);
		return stats.length > 0 ? stats[0] : null;
	}

	async getLadder() {
		return this.userRepository.query(`
			SELECT users.login, users.status, stats.*
			FROM users
			INNER JOIN users_stats
				AS stats
				ON stats.id = users.id
			ORDER BY stats.elo DESC, stats.victories DESC
		`);
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

	/*
		SETTERS
	*/

	async setTwoFactorAuthenticationSecret(userId: number, secret: string) {
		return this.userRepository.update({ id: userId }, { two_factor_auth_secret: secret });
	}

	async setTwoFactorAuthentication(userId: number, enabled: boolean) {
		return this.userRepository.update({ id: userId }, { two_factor_auth: enabled });
	}
}