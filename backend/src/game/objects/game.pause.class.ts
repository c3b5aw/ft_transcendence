import { GAME_MAX_PAUSES } from './game.constants';
import { User } from 'src/users/entities/user.entity';

export class GamePause {
	public paused: boolean = false;
	public pausedBy: string = "";
	public pausedUntil: Date = new Date(0);
	private pausesLeft: any = {};
	public nextUpdate: Date = new Date(0);

	public __repr__() {
		return {
			paused: this.paused,
			pausedBy: this.pausedBy,
			pausedUntil: this.pausedUntil,
		}
	}

	public pausesLefts(userID: number) {
		if (userID in this.pausesLeft)
			return this.pausesLeft[userID];
		this.pausesLeft[userID] = GAME_MAX_PAUSES;
	}

	public Pause(user: User, duration: number) {
		this.paused = true;
		this.pausedUntil = new Date(Date.now() + duration * 1000);
		this.nextUpdate = new Date();

		setTimeout(this.resume.bind(this), duration * 1000);

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
		this.paused = false;
		this.pausedBy = null;
		this.pausedUntil = new Date(0);
		this.nextUpdate = new Date(0);
	}
}