import { DataSource, DataSourceOptions } from 'typeorm';

//npm run migration:generate --name=MigrationName
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  username: 'postgres',
  password: 'root123',
  database: 'pos',
  synchronize: false,
  entities: ['dist/**/*.entity.{js,ts}'],
  migrations: ['dist/src/db/migrations/*.{js,ts}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
