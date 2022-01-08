import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as session from 'express-session'

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.use(
		session({
			secret: process.env.SESSION_SECRET || process.env.BACKEND_SESSION_SECRET,
			resave: false,
			saveUninitialized: false,
		})
	)

	if (process.env.NODE_ENV !== 'production') {
		const config = new DocumentBuilder()
			.setTitle('ft_transcendence API')
			.setBasePath('/api')
			.setDescription('')
			.setVersion('1.0')
			.addTag('')
			.build();
		const document = SwaggerModule.createDocument(app, config);
		SwaggerModule.setup('docs', app, document);
	}

	await app.listen(3000);
}
bootstrap();
