// GAME INSTANCE
const GAME_START_MAX_WAIT: number = 10;
const GAME_START_DELAY: number = 5;
const GAME_TICKS_PER_SECOND: number = 10;
const GAME_WIN_SCORE: number = 10;
const GAME_PAUSE_INTERVAL = 1000;

// GAME PAUSE
const GAME_PAUSE_DURATION: number = 30;
const GAME_MAX_PAUSES: number = 2;
const GAME_PAUSE_ON_SCORE_DURATION: number = 5;

// GAME RESOLUTION
const GAME_CANVAS_HEIGHT: number = 600;
const GAME_CANVAS_WIDTH: number = 1000;
const GAME_BORDER_SIZE: number = 20;

// GAME BALL
const GAME_BALL_START_X: number = GAME_CANVAS_WIDTH / 2;
const GAME_BALL_START_Y: number = GAME_CANVAS_HEIGHT / 2;
const GAME_BALL_RADIUS: number = 5;
const GAME_BALL_DEFAULT_SPEED: number = 20;
const GAME_BALL_MAX_SPEED: number = 10;
const GAME_BALL_SPEED_INCREASE = 1.5;
const GAME_BALL_MIN_ANGLE = 40;

// GAME PLAYER
const GAME_PLAYER_HEIGHT: number = 100;
const GAME_PLAYER_WIDTH: number = 5;
const GAME_PLAYER_START_Y: number = GAME_CANVAS_HEIGHT / 2 - GAME_PLAYER_HEIGHT / 2;
const GAME_PLAYER_SPEED: number = 50;

export {
	GAME_START_MAX_WAIT,
	GAME_START_DELAY,
	GAME_TICKS_PER_SECOND,
	GAME_WIN_SCORE,
	GAME_PAUSE_INTERVAL,

	GAME_PAUSE_DURATION,
	GAME_MAX_PAUSES,
	GAME_PAUSE_ON_SCORE_DURATION,
	
	GAME_CANVAS_HEIGHT,
	GAME_CANVAS_WIDTH,
	GAME_BORDER_SIZE,

	GAME_BALL_START_X,
	GAME_BALL_START_Y,
	GAME_BALL_RADIUS,
	GAME_BALL_DEFAULT_SPEED,
	GAME_BALL_MAX_SPEED,
	GAME_BALL_SPEED_INCREASE,
	GAME_BALL_MIN_ANGLE,

	GAME_PLAYER_HEIGHT,
	GAME_PLAYER_WIDTH,
	GAME_PLAYER_START_Y,
	GAME_PLAYER_SPEED,
}