import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Achievement } from "./entities/achievement.entity";

@Injectable()
export class AchievementsService {

	constructor(@InjectRepository(Achievement) private readonly achievementRepository: Repository<Achievement>) {}

}