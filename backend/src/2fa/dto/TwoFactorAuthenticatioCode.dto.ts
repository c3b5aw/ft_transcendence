import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class TwoFactorAuthenticationCodeDto {
	@IsString()
	@MinLength(6)
	@MaxLength(6)
	@ApiProperty({
		description: 'The code you got on your phone',
		minimum: 6,
	})
	twoFactorAuthenticationCode: string;
}