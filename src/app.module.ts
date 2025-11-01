import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';

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
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    HealthModule,
    MessagesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
