import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Debt Management API')
    .setDescription('API REST para gestión de deudas entre amigos')
    .setVersion('1.0')
    .addTag('users', 'Gestión de usuarios')
    .addTag('auth', 'Autenticación y autorización')
    .addTag('debts', 'Gestión de deudas')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`Application is running`);
  console.log(`Swagger docs available`);
}
bootstrap();
