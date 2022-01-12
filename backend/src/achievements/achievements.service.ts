import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Achievement } from "./entities/achievement.entity";

@Injectable()
export class AchievementsService {

	constructor(@InjectRepository(Achievement) private readonly achievementRepository: Repository<Achievement>) {}

	async findOneByID(id: number) : Promise<Achievement> {
		return this.achievementRepository.findOne( id );
	}

	async findAll() : Promise<Achievement[]> {
		return this.achievementRepository.find();
	}
}