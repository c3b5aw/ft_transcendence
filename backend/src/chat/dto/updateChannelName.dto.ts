import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateChannelNameDto {
	@IsString()
	@MinLength(3)
	@MaxLength(32)
	name: string;
}