import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestTimeInterceptor } from './common/interceptors/request-time.interceptor';
import { ParseIntIdPipe } from './common/pipes/parse-int-id.pipe';

/*
  nest new <project>
  cd <project>
  npm run start:dev
*/

// npm i class-validator class-transformer

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
    new ParseIntIdPipe(),
  );
  app.useGlobalInterceptors(new RequestTimeInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
