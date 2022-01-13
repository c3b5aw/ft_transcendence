import { Body, Controller, Get, Header, Param, Post, Req, Res,
		UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { diskStorage } from 'multer';
import { rename, unlink } from 'fs';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PostDisplayNameDto } from './dto/postDisplayName.dto';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { Friend } from 'src/friends/entities/friend.entity';
import { FriendsService } from 'src/friends/friends.service';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {

	constructor(private readonly usersService: UsersService,
		private readonly friendsService: FriendsService) {}

	@Get()
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getMyself(@Req() req: any) : Promise<User> {
		return this.usersService.findMe(req.user.id);
	}

	@Get('avatar')
	@UseGuards(JwtGuard)
	async getAvatar(@Req() req: any, 
					@Param('id') id: number, @Res() resp: Response) {
		return await this.usersService.sendAvatar( req.user.id, resp );
	}


	@Get('stats')
	@UseGuards(JwtGuard)
	async getStats(@Req() req: any, @Res() resp: Response) {
		return this.usersService.getStatsById( req.user.id );
	}

	@Get('friends')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getMyselfFriends(@Req() req: any) : Promise<Friend[]> {
		return this.friendsService.findAllAcceptedById( req.user.id );
	}

	@Get('friends/pending')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async getMyselfPendingFriendsRequest(@Req() req: any) : Promise<Friend[]> {
		return this.friendsService.findAllPendingById( req.user.id );
	}

	@Post('display_name')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	async setDisplayName(@Req() req: any, @Body() data: PostDisplayNameDto,
						@Res() resp: Response) {
		if (data.display_name.length < 3)
			return resp.status(400).json({
				error: 'Display name must be at least 3 characters long.',
			});

		if (data.display_name.length >= 64)
			return resp.status(400).json({
				error: 'Display name must be less than 64 characters long.',
			})
		
		const name: User = await this.usersService.findOneByDisplayName(data.display_name);
		if (name)
			return resp.status(409).json({	error: 'Display name already taken.' });

		await this.usersService.updateDisplayName(req.user.id, data.display_name);

		return JSON.stringify({
			message: 'Display name successfully updated.',
		});
	}
  
	// https://docs.nestjs.com/techniques/file-upload
	@Post('avatar')
	@UseGuards(JwtGuard)
	@Header('Content-Type', 'application/json')
	@UseInterceptors(FileInterceptor('file', {
		limits: {
			fileSize: 1024 * 1024 * 24, // ~24MB
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
			unlink('./public/uploads/' + req.user.id + '.jpg', (err) => {
				if (err)
					console.log(err);
			});
			return resp.status(400).json({
				error: 'Only jpeg images are accepted.',
			});
		}

		rename('./public/uploads/' + req.user.id + '.jpg', 
				'./public/avatars/' + req.user.id + '.jpg', (err) => {
			if (err) {
				unlink('./public/uploads/' + req.user.id + '.jpg', (err) => {
					if (err)
						console.log(err);
				});
				return resp.status(500).json({
					error: 'Failed while processing the file',
				});
			}
		});
	
		resp.json({ message: 'Avatar successfully updated.' })
	}
}