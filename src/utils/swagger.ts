import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function SwaggerDocs(app: any) {
  const SwaggerConfig = new DocumentBuilder()
    .setTitle('VPOS-API')
    .setDescription('The vpos api documentation description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const SwaggerOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(
    app,
    SwaggerConfig,
    SwaggerOptions,
  );

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
