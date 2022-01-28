import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserStats } from './entities/stats.entity';
import { Match } from 'src/matchs/entities/match.entity';
import { MatchType } from 'src/matchs/entities/types.enum';

@Injectable()
export class StatsService {
	private logger: Logger = new Logger('StatsService');

	constructor(@InjectRepository(UserStats)
		private readonly statsRepository: Repository<UserStats>) {}

	async updateFromMatch(match: Match) {
		const p1 = await this.findOneByID(match.player1);
		if (!p1)
			return this.errorPlayerNotFoundForMatch(match, match.player1);

		const p2 = await this.findOneByID(match.player2);
		if (!p2)
			return this.errorPlayerNotFoundForMatch(match, match.player2);

		p1.played++;
		p2.played++;

		if (match.player1_score > match.player2_score) {
			p1.victories++;
			p2.defeats++;
			if (match.type === MatchType.MATCH_RANKED) {
				const difference = (match.player1_score - match.player2_score) / 100;
				p1.elo += difference + 5;
				p2.elo -= difference - 3;
			}
		}
		else if (match.player1_score < match.player2_score) {
			p2.victories++;
			p1.defeats++;
			if (match.type === MatchType.MATCH_RANKED) {
				const difference = (match.player2_score - match.player1_score) / 100;
				p2.elo += difference + 5;
				p1.elo -= difference - 3;
			}
		}

		await this.statsRepository.save(p1);
		await this.statsRepository.save(p2);
	}

	async errorPlayerNotFoundForMatch(match: Match, player: number) {
		return this.logger.error(`Player (${player}) not found for match ${match.id}#${match.hash}`)
	}

	async findOneByID(id: number) : Promise<UserStats> {
		return this.statsRepository.query(`
			SELECT *
			FROM user_stats
			WHERE user = ${id};
		`);
	}
}