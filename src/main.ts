import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { SwaggerDocs } from './utils/swagger';
import * as basicAuth from 'express-basic-auth';
const port = parseInt(process.env.PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(
    '/docs',
    basicAuth({
      users: { admin: 'password' },
      challenge: true,
      realm: 'API Docs',
    }),
  );

  SwaggerDocs(app);
  app.enableCors();
  app.use(compression());
  app.use(cookieParser('trynestjsla'));
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, async () => {
    console.log(`Server is running on '${await app.getUrl()}'`);
  });
}
bootstrap();
