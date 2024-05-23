import { Env } from 'src/common/utils';
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
  entities: [__dirname + '/entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
