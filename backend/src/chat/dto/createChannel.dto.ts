import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateChannelDto {
	@IsString()
	@MinLength(3)
	@MaxLength(64)
	@ApiProperty()
	name: string;

	@IsString()
	@MinLength(0)
	@MaxLength(64)
	@ApiProperty()
	password: string;
}