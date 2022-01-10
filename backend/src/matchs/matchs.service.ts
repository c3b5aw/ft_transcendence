import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MatchsService {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	// async getMatchById(userId: number) {
	// }
// 
	// async getMatchs() {
// 
	// }
}
