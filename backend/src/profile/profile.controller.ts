import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {

	@Post('/display_name')
	@UseGuards(JwtGuard)
	setDisplayName() {
		// excepted string in body
	}

	@Post('/avatar')
	@UseGuards(JwtGuard)
	setAvatar() {
		// excepted image in body
		// download image into public folder
	}
}