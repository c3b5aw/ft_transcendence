import { GAME_MAX_PAUSES } from './game.constants';
import { User } from 'src/users/entities/user.entity';

export class GamePause {
	public paused: boolean;
	public pausedBy: string;
	public pausedUntil: Date;
	private pausesLeft: any;
	public nextUpdate: Date;

	public pausesLefts(userID: number) {
		if (userID in this.pausesLeft)
			return this.pausesLeft[userID];
		this.pausesLeft[userID] = GAME_MAX_PAUSES;
	}

	public Pause(user: User, duration: number) {
		this.paused = true;
		this.pausedUntil = new Date(Date.now() + duration * 1000);
		this.nextUpdate = new Date();

		setTimeout(() => { this.paused = false; }, duration * 1000);

		if (user)
			this.pausedBy = user.login;
		else
			this.pausedBy = "Server";
		
		if (user) {
			this.pausesLefts(user.id);
			this.pausesLeft[user.id]--;
		}
	}

	public resume() {
		if (!this.paused)
			return ;
		this.paused = false;
		this.pausedBy = null;
		this.pausedUntil = new Date(0);
		this.nextUpdate = new Date(0);
	}
}