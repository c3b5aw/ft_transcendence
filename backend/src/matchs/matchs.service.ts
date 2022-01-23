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
		return this.matchRepository.query(`
			SELECT matchs.*, 
				p1.login AS player1_login,
				p2.login AS player2_login
			FROM matchs
			INNER JOIN users
				AS p1
				ON p1.id = matchs.player1
			INNER JOIN users
				AS p2
				ON p2.id = matchs.player2
			WHERE matchs.id = ${id};
		`);
	}

	async findAllByPlayerId(id: number) : Promise<Match[]> {
		return this.matchRepository.query(`
			SELECT matchs.*, 
				p1.login AS player1_login,
				p2.login AS player2_login
			FROM matchs
			INNER JOIN users
				AS p1
				ON p1.id = matchs.player1
			INNER JOIN users
				AS p2
				ON p2.id = matchs.player2
			WHERE (
				matchs.player1 = ${id}
				OR matchs.player2 = ${id}
			)
			ORDER BY matchs.date DESC;
		`);
	}

	async findAllInProgress() : Promise<Match[]> {
		return this.matchRepository.query(`
			SELECT matchs.*,
				p1.login AS player1_login,
				p2.login AS player2_login
			FROM matchs
			INNER JOIN users
				AS p1
				ON p1.id = matchs.player1
			INNER JOIN users
				AS p2
				ON p2.id = matchs.player2
			WHERE matchs.finished = false
			ORDER BY matchs.date DESC;
		`);
	}

	/*
		COUNT

		- countAll
	*/

	async countAll() : Promise<number> {
		return this.matchRepository.count();
	}
}
