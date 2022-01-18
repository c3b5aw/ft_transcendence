import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/entities/roles.enum';
import { Channel } from 'src/chat/entities/channel.entity';

export class ModerationFlow {
	err: boolean;
	target: User;
	role: UserRole;
	channel: Channel;
}