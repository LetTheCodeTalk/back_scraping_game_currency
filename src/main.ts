import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(4500, () => {
    const server = app.getHttpServer();
    const address = server.address();

    let host: string;

    if (typeof address === 'string') {
      host = address;
    } else if (address) {
      const { port, address: ipAddress } = address;
      host = ipAddress === '::' ? 'localhost' : ipAddress;
      host += `:${port}`;
    } else {
      host = 'localhost';
    }

    console.log(`Application running on: http://${host}`);
  });
}

bootstrap();