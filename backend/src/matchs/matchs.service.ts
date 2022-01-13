import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Match } from './entities/match.entity';

@Injectable()
export class MatchsService {

	constructor(@InjectRepository(Match) private readonly matchRepository: Repository<Match>) {}

	/*
		FINDER

		- findAll
		- findOneByID
	*/

	// async findAll() : Promise<Match[]> {
	// 	return this.matchRepository.find();
	// }

	async findOneByID(id: number) : Promise<Match> {
		return this.matchRepository.findOne({ id });
	}

	async findAllByID(id: number) : Promise<Match[]> {
		return this.matchRepository.find({ 
			where: [
				{ player_1: id },
				{ player_2: id }
<<<<<<< HEAD
			]
=======
			],
			order: {
				date: "DESC",
			}
>>>>>>> origin/backend-login-rewrite
		});
	}

	/*
		DELETER

		- deleteOneByID
	*/

	// async deleteOneByID(id: number) : Promise<Match> {
	// 	const match: Match = await this.matchRepository.findOne({ id });
	// 	if (!match)
	// 		return null;
	// 	return this.matchRepository.remove(match);
	// }
}
