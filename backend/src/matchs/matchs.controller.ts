import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('matchs')
@Controller('matchs')
export class MatchsController {
	
	@Get('/:id')
	@UseGuards(JwtGuard)
	getMatch() {
		
	}

	// admin only
	// @Get('/') // return all matchs

	// admin only
	// @Delete('/:id') // delete match by id
}