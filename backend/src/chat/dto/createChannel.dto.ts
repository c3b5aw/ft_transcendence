import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateChannelDto {
	@IsString()
	@MinLength(3)
	@MaxLength(64)
	@ApiProperty({
		description: 'The name of the channel',
		minimum: 3,
	})
	name: string;

	@IsString()
	@MinLength(0)
	@MaxLength(64)
	@ApiProperty({
		description: 'The password of the channel or empty string if it is not private',
		minimum: 0,
	})
	password: string;
}

export class CreateDirectChannelDto {
	@IsString()
	@MinLength(3)
	@MaxLength(64)
	@ApiProperty({
		description: 'The user login you want to talk with',
		minimum: 3,
	})
	login: string;
}