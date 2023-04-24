import { DataSource } from 'typeorm';
export default new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
});
