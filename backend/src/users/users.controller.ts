import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('users')
@Controller('users')
export class UserController {
	
	@Get('/')
	getUsers() {}

	@Get('/:id')
	getUser() {}

	@Get('/:id/stats')
	getUserStats() {}

	@Get('/:id/rank')
	getUserRank() {}

	// @Get('api/matchs/id')
	// @Get('api/matchs/)

	@Get('/:id/matchs')
	getUserMatchs() {}

	@Get('/:id/friends')
	getUserFriens() {}

	@Get('/:id/avatar')
	getUserAvatar() {}

	@Get('/:id/achievements')
	getUserAchievements() {}
}