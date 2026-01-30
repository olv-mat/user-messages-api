import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { Environments } from './common/enums/environments.enum';
import { ErrorLoggingInterceptor } from './common/interceptors/error-logging.interceptor';
import { RequestTimeInterceptor } from './common/interceptors/request-time.interceptor';
import { ParseIntIdPipe } from './common/pipes/parse-int-id.pipe';
import { swaggerSetup } from './common/swagger/setup.swagger';

/*
  nest new <project>
  cd <project>
  npm run start:dev
*/

// npm i class-validator class-transformer
// npm i helmet

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
  if (process.env.NODE_ENV === Environments.PRODUCTION) {
    app.use(helmet()); // Set Security-Related HTTP Headers
    app.enableCors({}); // Allow Requests From Other Domains
  }
  if (process.env.NODE_ENV !== Environments.PRODUCTION) swaggerSetup(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
