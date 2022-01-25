import { Socket } from 'socket.io';

import { User } from 'src/users/entities/user.entity';

export class WSClient extends Socket {
	user: User;
}
