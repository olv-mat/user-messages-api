/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ErrorLoggingInterceptor } from 'src/common/interceptors/error-logging.interceptor';
import { RequestTimeInterceptor } from 'src/common/interceptors/request-time.interceptor';
import { CryptographyModule } from 'src/common/modules/cryptography/cryptography.module';
import { RegisterRootUserSeed } from 'src/common/modules/seed/register-root-user.seed';
import { SeedModule } from 'src/common/modules/seed/seed.module';
import { TokenModule } from 'src/common/modules/token/token.module';
import { ParseIntIdPipe } from 'src/common/pipes/parse-int-id.pipe';
import { makeRegisterDto } from 'src/common/tests/factories/register-dto.factory';
import { AuthModule } from 'src/modules/auth/auth.module';
import { HealthModule } from 'src/modules/health/health.module';
import { MessageModule } from 'src/modules/message/message.module';
import { UserModule } from 'src/modules/user/user.module';
import request from 'supertest';

const registerUserAndLogin = async (app: INestApplication) => {
  const dto = makeRegisterDto();
  const response = await request(app.getHttpServer())
    .post('/auth/register')
    .send(dto);
  return response.body.accessToken;
};

const loginAsRoot = async (app: INestApplication) => {
  const response = await request(app.getHttpServer()).post('/auth/login').send({
    email: process.env.ROOT_USER_EMAIL,
    password: process.env.ROOT_USER_PASSWORD,
  });
  return response.body.accessToken;
};

describe('User (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
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
    await app.get(RegisterRootUserSeed).run();
    await app.init();
  }, 20000);

  describe('/users (GET)', () => {
    it('should throw unauthorized exception when user is not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.UNAUTHORIZED);
      expect(response.body).toEqual({
        message: 'Missing authentication token',
        error: 'Unauthorized',
        statusCode: 401,
      });
    });

    it('should throw forbidden exception when user has no policy', async () => {
      const token = await registerUserAndLogin(app);
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.FORBIDDEN);
      expect(response.body).toEqual({
        message: 'Forbidden resource',
        error: 'Forbidden',
        statusCode: 403,
      });
    });

    it('should return a list of users', async () => {
      const token = await loginAsRoot(app);
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);
      response.body.forEach((user: object) => {
        expect(Object.keys(user).sort()).toEqual(['email', 'id', 'name']);
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
