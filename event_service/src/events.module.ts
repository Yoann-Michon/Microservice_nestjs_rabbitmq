import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [EventsController],
  providers: [EventService],
  imports: [
    TypeOrmModule.forFeature([Event]),
    ConfigModule.forRoot({ envFilePath: '.env' }),
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
      entities: [Event],
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
  },
])],
})
export class EventsModule {}
