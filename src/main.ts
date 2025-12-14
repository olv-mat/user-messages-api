import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorLoggingInterceptor } from './common/interceptors/error-logging.interceptor';
import { RequestTimeInterceptor } from './common/interceptors/request-time.interceptor';
import { RegisterRootUserSeed } from './common/modules/seed/register-root-user.seed';
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
  app.useGlobalInterceptors(
    new RequestTimeInterceptor(),
    new ErrorLoggingInterceptor(),
  );
  await app.get(RegisterRootUserSeed).run();
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
