import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostDisplayNameDto {
	@IsString()
	@MinLength(3)
	@MaxLength(64)
	@ApiProperty()
	display_name: string;
}