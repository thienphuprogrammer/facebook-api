import { Env } from '../utils/env';
import { DataSource } from 'typeorm';
export const datasource = new DataSource({
  type: 'mysql',
  host: Env.DB_HOST,
  port: Env.DB_PORT,
  database: Env.DB_NAME,
  username: Env.DB_USER,
  password: Env.DB_PASSWORD,
  synchronize: true,
  logging: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});
