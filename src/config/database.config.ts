import { DataSource, DataSourceOptions } from 'typeorm';

//npm run migration:generate --name=MigrationName
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  synchronize: true,
  entities: ['dist/**/*.entity.{js,ts}'],
  migrations: ['dist/db/migrations/*.{js,ts}'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
