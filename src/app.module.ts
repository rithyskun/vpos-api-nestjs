import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { dataSourceOptions } from './config/database.config';
@Module({
  imports: [
    AuthModule,
    HealthModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 2,
    }),
    UsersModule,
    TokensModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
