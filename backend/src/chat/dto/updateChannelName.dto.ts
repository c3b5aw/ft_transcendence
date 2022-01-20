import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateChannelNameDto {
	@IsString()
	@MinLength(3)
	@MaxLength(32)
	@ApiProperty({
		description: 'The new name of the channel',
		minimum: 3,
	})
	name: string;
}