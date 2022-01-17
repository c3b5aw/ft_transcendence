import { IsString, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateChannelDto {
	@IsString()
	@MinLength(3)
	@MaxLength(64)
	name: string;

	@IsString()
	@MinLength(0)
	@MaxLength(64)
	password: string;

	@IsBoolean()
	tunnel: boolean;
}