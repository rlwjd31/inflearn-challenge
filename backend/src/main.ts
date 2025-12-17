import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    // * ValidationiPipe를 설정하면 자동으로 class-validator의 검증을 수행함
    new ValidationPipe({
      transform: true, // * 👉🏻 class-transformer를 사용하여 요청 데이터를 자동으로 변환함
    }),
  );
  // * swagger 설정
  const config = new DocumentBuilder()
    .setTitle('clone inflearn API 문서')
    .setDescription('api 상세 문서')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'access-token',
        description: 'Enter access token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
