import { Body, Controller, Header, Post, Req, Res,
		UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { diskStorage } from 'multer';
import { rename, unlink } from 'fs';

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
	async setDisplayName(@Req() req: any, @Body() data: PostDisplayNameDto,
						@Res() resp: Response) {
		if (data.display_name.length < 3)
			return resp.status(400).json({
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
	@UseInterceptors(FileInterceptor('file', {
		limits: {
			fileSize: 1024 * 1024 * 24,
		},
		storage: diskStorage({
			destination: './src/public/uploads',
			filename: (req: any, file, cb) => {
				return cb(null, req.user.id + '.jpg');
			}
		}),
	}))
	async setAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File,
					@Res() resp: Response) {
		if (!file)
			return resp.status(400).json({
				error: 'No file was uploaded.',
			});

		if (file.mimetype !== 'image/jpeg') {
			unlink('./src/public/uploads/' + req.user.id + '.jpg', (err) => {
				if (err)
					console.log(err);
			});
			return resp.status(400).json({
				error: 'Only jpeg images are accepted.',
			});
		}

		rename('./src/public/uploads/' + req.user.id + '.jpg', 
				'./src/public/avatars/' + req.user.id + '.jpg', (err) => {
			if (err) {
				unlink('./src/public/uploads/' + req.user.id + '.jpg', (err) => {
					if (err)
						console.log(err);
				});
				return resp.status(500).json({
					error: 'Failed while processing the file',
				});
			}
		});
	
		resp.json({
			message: 'Avatar successfully updated.',
		})
	}
}