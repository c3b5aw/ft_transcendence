import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {

	@ApiResponse({ status: 200, description: 'The service is up and running' })
	@Get('health')
	getHealth(): string {
		return 'OK';
	}

}
