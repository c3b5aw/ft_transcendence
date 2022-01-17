import { IsString, MinLength, MaxLength } from 'class-validator';

export class PostDisplayNameDto {
	@IsString()
	@MinLength(3)
	@MaxLength(64)
	display_name: string;
}