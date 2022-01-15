import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Match } from './entities/match.entity';

@Injectable()
export class MatchsService {

	constructor(@InjectRepository(Match) private readonly matchRepository: Repository<Match>) {}

	/*
		FINDER

		- findOneByID
		- findAllByPlayerId
	*/

	async findOneById(id: number) : Promise<Match> {
		return this.matchRepository.findOne({ id });
	}

	async findAllByPlayerId(id: number) : Promise<Match[]> {
		return this.matchRepository.find({ 
			where: [
				{ player_1_id: id },
				{ player_2_id: id }
			],
			order: { date: "DESC" }
		});
	}


	/*
		COUNT

		- countAll
	*/

	async countAll() : Promise<number> {
		return this.matchRepository.count();
	}
}
