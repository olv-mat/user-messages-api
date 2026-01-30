import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

/* 
  npm install @nestjs/swagger swagger-ui-express
  npm install swagger-themes
*/

export function swaggerSetup(app: INestApplication): void {
  const documentBuilder = new DocumentBuilder()
    .setTitle('Basic Chat API')
    .setDescription(
      `A basic real-time chat API built with NestJS, featuring user and message modules, 
      WebSocket-based communication, and secure JWT authentication with policy-based authorization.`.trim(),
    )
    .setVersion('1.0')
    .addBearerAuth()
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
}
