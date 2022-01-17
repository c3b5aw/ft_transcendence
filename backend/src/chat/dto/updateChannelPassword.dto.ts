import { IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateChannelPasswordDto {
	@IsString()
	@MinLength(0)
	@MaxLength(64)
	password: string;
}