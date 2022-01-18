import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');

	app.useGlobalPipes(new ValidationPipe());

	app.use(cookieParser());
	app.use(passport.initialize());
	app.use(passport.session());

	app.enableCors({
		origin: '*',
		credentials: true
	});	

	const config = new DocumentBuilder()
		.setTitle('ft_transcendence API')
		.setDescription('')
		.setVersion('1.0')
		.addTag('')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);

	await app.listen(3000);
}
bootstrap();
