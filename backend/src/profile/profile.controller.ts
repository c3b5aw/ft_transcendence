import { Body, Controller, Get, Header, Param, Post, Req, Res,
		UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
<<<<<<< HEAD
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
=======
import { ApiTags, ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
>>>>>>> origin/main
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
@ApiCookieAuth()
@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {

	constructor(private readonly usersService: UsersService,
		private readonly friendsService: FriendsService) {}

	@Get()
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get yours details' })
	async getMyself(@Req() req: any) : Promise<User> {
		return this.usersService.findMe(req.user.id);
	}

	@Get('avatar')
	@Header('Content-Type', 'image/jpg')
	@ApiOperation({ summary: 'Get your avatar as jpg' })
	async getAvatar(@Req() req: any, 
					@Param('id') id: number, @Res() resp: Response) {
		return await this.usersService.sendAvatar( req.user.id, resp );
	}


	@Get('stats')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get yours stats' })
	async getStats(@Req() req: any, @Res() resp: Response) {
		const userStats = await this.usersService.getStatsById( req.user.id );
		resp.send(userStats);
	}

	@Get('friends')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get yours accepted friends' })
	async getMyselfFriends(@Req() req: any) : Promise<Friend[]> {
		return this.friendsService.findAllAcceptedById( req.user.id );
	}

	@Get('friends/pending')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Get your pending friendship' })
	async getMyselfPendingFriendsRequest(@Req() req: any) : Promise<Friend[]> {
		return this.friendsService.findAllPendingById( req.user.id );
	}

	@Post('display_name')
	@Header('Content-Type', 'application/json')
	@ApiOperation({ summary: 'Update your display name' })
	async setDisplayName(@Req() req: any, @Body() data: PostDisplayNameDto,
						@Res() resp: Response) {
		const name: User = await this.usersService.findOneByDisplayName(data.display_name);
		if (name) {
			if (name.id !== req.user.id)
				return resp.status(409).json({	error: 'display name already taken' });
			return resp.status(409).json({	error: 'you own this display name already' });
		}

		await this.usersService.updateDisplayName(req.user.id, data.display_name);

		resp.json({ message: 'display name successfully updated' });
	}
  
	// https://docs.nestjs.com/techniques/file-upload
	@Post('avatar')
	@Header('Content-Type', 'application/json')
	@UseInterceptors(FileInterceptor('file', {
		limits: { fileSize: 1024 * 1024 * 24 },  // ~24MB
		storage: diskStorage({
			destination: './public/uploads',
			filename: (req: any, file, cb) => {
				return cb(null, req.user.id + '.jpg');
			}
		}),
	}))
	@ApiOperation({ summary: 'Update your avatar' })
	async setAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File,
					@Res() resp: Response) {
		if (!file)
			return resp.status(400).json({ error: 'no file was uploaded.' });

		if (file.mimetype !== 'image/jpeg') {
			unlink('./public/uploads/' + req.user.id + '.jpg', (err) => {
				if (err)
					console.log(err);
			});
			return resp.status(400).json({ error: 'only jpeg images are accepted' });
		}

		rename('./public/uploads/' + req.user.id + '.jpg', 
				'./public/avatars/' + req.user.id + '.jpg', (err) => {
			if (err) {
				console.log(err);
				unlink('./public/uploads/' + req.user.id + '.jpg', (err_fallback) => {
					if (err_fallback)
						console.log(err_fallback);
				});
				return resp.status(500).json({ error: 'failed while processing the file' });
			}
		});
	
		resp.json({ message: 'avatar successfully updated' })
	}
}