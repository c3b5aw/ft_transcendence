import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChannelPasswordDto {
	@IsString()
	@MinLength(0)
	@MaxLength(64)
	@ApiProperty()
	password: string;
}