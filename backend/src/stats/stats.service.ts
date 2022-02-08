import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserStats } from './entities/stats.entity';

import { Match } from 'src/matchs/entities/match.entity';
import { MatchType } from 'src/matchs/entities/types.enum';

import { AchievementsService } from 'src/achievements/achievements.service';

@Injectable()
export class StatsService {
	private logger: Logger = new Logger('StatsService');

	constructor(@InjectRepository(UserStats)
		private readonly statsRepository: Repository<UserStats>,
		
		private readonly achievementsService: AchievementsService) {}

	async updateFromMatch(match: Match) {
		const players: UserStats[] = [ await this.findOneByID(match.player1),
				await this.findOneByID(match.player2) ];

		const loser: UserStats = match.winner === players[0].id ? players[0] : players[1];
		const winner: UserStats = match.winner === players[0].id ? players[1] : players[0];

		const elo_diff = Math.ceil((winner.elo - loser.elo) / 10);
		await this.updateMatchPlayer(match, loser, elo_diff, false);
		await this.updateMatchPlayer(match, winner, elo_diff, true);
	}

<<<<<<< HEAD
		if (match.player1_score > match.player2_score) {
			p1.victories++;
			// regarder si le winner a unlock un achievement
			p2.defeats++;
			if (match.type === MatchType.MATCH_RANKED) {
				const difference = Math.ceil((match.player1_score - match.player2_score) / 100);
				p1.elo += difference + 2;
				p2.elo -= difference - 1;
			}
		}
		else if (match.player1_score < match.player2_score) {
			p2.victories++;
			// regarder si le winner a unlock un achievement
			p1.defeats++;
			if (match.type === MatchType.MATCH_RANKED) {
				const difference = Math.ceil((match.player2_score - match.player1_score) / 100);
				p2.elo += difference + 2;
				p1.elo -= difference - 1;
			}
		}
		await this.statsRepository.save(p1);
		await this.statsRepository.save(p2);

		// gerer les achievements
=======
	async updateMatchPlayer(match: Match, player: UserStats, elo_diff: number, winner: boolean) {
		player.played++;
		
		if (winner) {
			player.victories++;
			await this.achievementsService.updateAchievements(player, match);
		} else {
			player.defeats++;
		}

		if (match.type === MatchType.MATCH_RANKED) {
			if (winner)
				player.elo += (elo_diff + 2);
			else
				player.elo -= (elo_diff + 1);
		}

		return this.statsRepository.save(player);
>>>>>>> origin/main
	}

	async errorPlayerNotFoundForMatch(match: Match, player: number) {
		return this.logger.error(`Player (${player}) not found for match ${match.id}#${match.hash}`)
	}

	async findOneByID(id: number) : Promise<UserStats> {
		const stats : UserStats[] = await this.statsRepository.query(`
			SELECT *
			FROM users_stats
			WHERE id = ${id};
		`);
		return stats.length > 0 ? stats[0] : null;
	}

	async createUserStats(userID: number) : Promise<UserStats> {
		const stats = new UserStats();
		stats.id = userID;
		stats.played = 0;
		stats.victories = 0;
		stats.defeats = 0;
		return this.statsRepository.save(stats);
	}
}