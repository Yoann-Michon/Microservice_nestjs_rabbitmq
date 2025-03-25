import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { EventsModule } from './events.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(EventsModule,{
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_HOST],
      queue: process.env.RABBITMQ_EVENT_QUEUE,
      queueOptions: {
        durable: true
      },
    },
  });
  await app.listen();
}
bootstrap();
