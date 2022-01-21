import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserStats } from './entities/stats.entity';

@Injectable()
export class StatsService {
	constructor(@InjectRepository(UserStats)
		private readonly statsRepository: Repository<UserStats>) {}
}