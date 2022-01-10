import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProfileService {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	// async setDisplayName(userId: number, displayName: string) {

	// }

	// async setAvatar(userId: number, avatar: string) {

	// }
}