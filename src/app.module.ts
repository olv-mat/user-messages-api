import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
import { RequestUuidMiddleware } from './common/middlewares/request-uuid.middleware';
import { CryptographyModule } from './common/modules/cryptography/cryptography.module';
import { SeedModule } from './common/modules/seed/seed.module';
import { TokenModule } from './common/modules/token/token.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';

// nest generate resource <resource> (nest g res <resource>)

/* 
  npm i @nestjs/typeorm typeorm
  npm i @nestjs/config
  npm i  mysql2
*/

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
