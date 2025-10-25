import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/*
  nest new <project>
  cd <project>
  npm run start:dev
*/

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
