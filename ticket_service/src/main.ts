import { NestFactory } from '@nestjs/core';
import { TicketsModule } from './tickets.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TicketsModule,{
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_HOST],
        queue: process.env.RABBITMQ_TICKET_QUEUE,
        queueOptions: {
          durable: true
        },
      },
    });
  await app.listen();
}
bootstrap();
