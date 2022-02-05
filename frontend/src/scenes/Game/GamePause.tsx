import { getFactors } from './GameConstants';

export default class GamePause {
	public paused: boolean = false;
	public pausedBy: string = "";
	public pausedUntil: Date = new Date(0);

	public Pause(user: string = 'Server', duration: number) {
		this.paused = true;
		this.pausedBy = user;
		this.pausedUntil = new Date(Date.now() + duration * 1000);
	}

	public update(arg: any) {
		this.paused = arg.paused;
		this.pausedBy = arg.pausedBy;
		this.pausedUntil = arg.pausedUntil;
	}

	public draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = '#fff';

		const { widthFactor } = getFactors(ctx);
		const pixels = Math.floor(48 * widthFactor);

		ctx.font = `${pixels}px monospace`;
		ctx.textAlign = 'center';

		ctx.fillText(`Game paused by ${this.pausedBy}`,
					ctx.canvas.width / 2,
					ctx.canvas.height / 2);

		const time_left: number = Math.floor((this.pausedUntil.getTime() - Date.now()) / 1000);
		ctx.fillText(`Resume in ${time_left} seconds`,
					ctx.canvas.width / 2,
					ctx.canvas.height / 2 + pixels);
	}
}