import 'dotenv/config';
import { DataSource } from 'typeorm';
import { MessageEntity } from './modules/message/entities/message.entity';
import { UserEntity } from './modules/user/entities/user.entity';

/* 
  npm run migration:generate -- src/migrations/...
  npm run migration:run
  npm run migration:generate
*/

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [MessageEntity, UserEntity],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
});
