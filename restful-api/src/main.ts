import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(AppValidationPipe());
  app.setGlobalPrefix('api');

  const host = configService.get<string>('APP_HOST', 'localhost');
  const port = configService.get<number>('APP_PORT', 3000);

  await app.listen(port, host);

  console.log(`Server is running`);
}
bootstrap();
