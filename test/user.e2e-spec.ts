import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ErrorLoggingInterceptor } from 'src/common/interceptors/error-logging.interceptor';
import { RequestTimeInterceptor } from 'src/common/interceptors/request-time.interceptor';
import { CryptographyModule } from 'src/common/modules/cryptography/cryptography.module';
import { SeedModule } from 'src/common/modules/seed/seed.module';
import { TokenModule } from 'src/common/modules/token/token.module';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { AuthModule } from 'src/modules/auth/auth.module';
import { HealthModule } from 'src/modules/health/health.module';
import { MessageModule } from 'src/modules/message/message.module';
import { UserModule } from 'src/modules/user/user.module';

describe('User (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
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
            dropSchema: true,
          }),
        }),
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
    }).compile();

    app = module.createNestApplication();
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
    await app.init();
  }, 20000);

  it('/ (GET)', () => {});

  afterAll(async () => {
    await app.close();
  });
});
