import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { SwaggerDocs } from './utils/swagger';
import * as basicAuth from 'express-basic-auth';
import { Transport } from '@nestjs/microservices';
const port = parseInt(process.env.PORT);
const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use(
    '/docs',
    basicAuth({
      users: { admin: 'password' },
      challenge: true,
      realm: 'API Docs',
    }),
  );
  SwaggerDocs(app);
  app.use(compression());
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: true,
  });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 8123,
    },
  });

  await app.listen(port, async () => {
    logger.log(`Server is running on '${await app.getUrl()}'`);
  });
}
bootstrap();
