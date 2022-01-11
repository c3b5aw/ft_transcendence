import { Body, Controller, Header, Post, Req,
		UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { response } from 'express';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PostDisplayNameDto } from './dto/postDisplayName.dto';

import { UsersService } from 'src/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {

	constructor(private readonly usersService: UsersService) {}

	@Post('/display_name')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async setDisplayName(@Req() req: any, @Body() data: PostDisplayNameDto) {
		if (data.display_name.length < 3)
			return response.status(400).json({
				error: 'Display name must be at least 3 characters long.',
			});
		
		await this.usersService.setDisplayName(req.user.id, data.display_name);

		return JSON.stringify({
			message: 'Display name successfully updated.',
		});
	}

	// https://docs.nestjs.com/techniques/file-upload
	@Post('/avatar')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	@UseInterceptors(FileInterceptor('picture'))
	setAvatar(@UploadedFile() file: Express.Multer.File) {
		console.log(file);
		// excepted image in body
		// download image into public folder
	}
}