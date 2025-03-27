import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Payment } from './entities/payment.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forFeature([Ticket,Payment]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>("DB_HOST"),
        port: configService.get<number>("DB_PORT"),
        username: configService.get<string>("DB_USERNAME"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_NAME"),
        entities: [Ticket,Payment],
        synchronize: true,
      }),
    }),
    ClientsModule.registerAsync([
    {
      name: 'API_GATEWAY_SERVICE',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('RABBITMQ_HOST') || ''],
          queue: configService.get<string>('RABBITMQ_API_GATEWAY_QUEUE'),
          queueOptions: { durable: true },
        },
      }),
    },{
      name: 'NOTIFICATION_SERVICE',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('RABBITMQ_HOST') || ''],
          queue: configService.get<string>('RABBITMQ_NOTIFICATION_QUEUE'),
          queueOptions: { durable: true },
        },
      }),
    }
  ]),],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule { }
