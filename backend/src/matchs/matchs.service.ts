import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { createHash } from 'crypto';

import { Repository } from 'typeorm';

import { Match } from './entities/match.entity';
import { MatchType } from './entities/types.enum';

@Injectable()
export class MatchsService {

	constructor(@InjectRepository(Match)
				private readonly matchRepository: Repository<Match>) {}

	/*
		CREATER
	*/

	async create(player1: number, player2: number, type: MatchType) : Promise<Match> {
		const match = new Match();

		match.hash = createHash('md5').update(Math.random().toString(36).substring(1, 16) + Math.random().toString(36).substring(1, 16)).digest('hex');
		match.player1 = player1;
		match.player2 = player2;
		match.date = new Date();
		match.winner = -1;
		match.type = type;
		match.finished = false;

		return this.matchRepository.save(match);
	}

	/*
		FINDER

		- findOneByID
		- findAllByPlayerId
	*/

	async findOneById(id: number) : Promise<Match> {
		const match: Match[] = await this.matchRepository.query(`
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

		return match.length > 0 ? match[0] : null;
	}

	async findOneByHash(hash: string) : Promise<Match> {
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
			WHERE matchs.hash = '${hash}';
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

	async findPendingMatch(playerID: number): Promise<Match> {
		const matchs: Match[] = await this.matchRepository.query(`
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
			WHERE matchs.finished = false AND (
				matchs.player1 = ${playerID}
				OR matchs.player2 = ${playerID}
			)
			LIMIT 1;
		`);
		
		return matchs.length > 0 ? matchs[0] : null;
	}

	/*
		COUNT

		- countAll
	*/

	async countAll() : Promise<number> {
		return this.matchRepository.count();
	}

	/*
		UPDATE
	*/

	async update(match: Match) : Promise<Match> {
		return this.matchRepository.save(match);
	}
}
