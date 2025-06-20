import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API Alten')
    .setDescription('Documentation de l\'API e-commerce Alten')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
    app.enableCors({
    origin: 'http://localhost:3001', // ← ton front
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
