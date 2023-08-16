import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { dataSourceOptions } from './config/database.config';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './auth/interceptors/logger.interceptor';
import { RolesModule } from './roles/roles.module';

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
      limit: 10,
    }),
    UsersModule,
    TokensModule,
    RolesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/(.*)', 'health')
      .forRoutes('*');
  }
  constructor(private dataSource: DataSource) { }
}
