import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger/dist';
import { Env } from './common/utils';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.use(cors({ origin: '*' }));
  app.use(cookieParser(configService.get<string>('COOKIE_SECRET')));
  app.use(helmet());
  app.enableCors({
    credentials: true,
    origin: `https://${configService.get<string>('domain')}`,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Authentication API')
    .setDescription('A OAuth2.0 authentication API made with NestJS')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addTag('Authentication API')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get<number>('port'));
}

bootstrap().then(() => console.log('Server started'));
