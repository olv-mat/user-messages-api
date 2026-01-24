import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { AppModule } from './app.module';
import { ErrorLoggingInterceptor } from './common/interceptors/error-logging.interceptor';
import { RequestTimeInterceptor } from './common/interceptors/request-time.interceptor';
import { ParseIntIdPipe } from './common/pipes/parse-int-id.pipe';

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
  if (process.env.NOD_ENV === 'production') {
    app.use(helmet()); // Set Security-Related HTTP Headers
    app.enableCors({}); // Allow Requests From Other Domains
  }

  const documentBuilder = new DocumentBuilder()
    .setTitle('Basic Chat API')
    .setDescription(
      `A basic real-time chat API built with NestJS, featuring user and message modules, 
      WebSocket-based communication, and secure JWT authentication with policy-based authorization.`.trim(),
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, documentBuilder);
  const theme = new SwaggerTheme();
  SwaggerModule.setup('api', app, document, {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
