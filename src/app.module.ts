import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
import { RequestUuidMiddleware } from './common/middlewares/request-uuid.middleware';
import { CryptographyModule } from './common/modules/cryptography/cryptography.module';
import { SeedModule } from './common/modules/seed/seed.module';
import { TokenModule } from './common/modules/token/token.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';

/* 
  nest generate resource <resource> 
  nest g res <resource>
*/

@Module({
  imports: [
    // npm i @nestjs/config
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    /* 
      npm i @nestjs/typeorm typeorm
      npm i mysql2
    */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('DATABASE_HOST'),
        port: configService.getOrThrow('DATABASE_PORT'),
        username: configService.getOrThrow('DATABASE_USERNAME'),
        password: configService.getOrThrow('DATABASE_PASSWORD'),
        database: configService.getOrThrow('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    // npm i @nestjs/serve-static
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'pictures'),
      serveRoot: '/pictures',
    }),
    CryptographyModule,
    SeedModule,
    TokenModule,
    AuthModule,
    HealthModule,
    MessageModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestUuidMiddleware).forRoutes('*');
  }
}
