import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApisController } from './apis.controller';
import { ApisService } from './apis.service';
import { EventsService } from './events/events.service';
import { UsersService } from './users/users.service';
import { UploadPictureModule } from '@upload/upload-picture';
import { NotificationsService } from './notifications/notifications.service';
import { EventsController } from './events/events.controller';
import { UsersController } from './users/users.controller';
import { NotificationsController } from './notifications/notifications.controller';

@Module({
  imports: [
    UploadPictureModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_HOST') || ''],
            queue: configService.get<string>('RABBITMQ_USER_QUEUE'),
            queueOptions: { durable: true },
          },
        }),
      },
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_HOST') || ''],
            queue: configService.get<string>('RABBITMQ_AUTH_QUEUE'),
            queueOptions: { durable: true },
          },
        }),
      },{
        name: 'EVENT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_HOST') || ''],
            queue: configService.get<string>('RABBITMQ_EVENT_QUEUE'),
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
      },{
        name: 'TICKET_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_HOST') || ''],
            queue: configService.get<string>('RABBITMQ_TICKET_QUEUE'),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [ApisController,EventsController,UsersController,NotificationsController],
  providers: [ApisService,EventsService,UsersService,NotificationsService],
})
export class ApiGatewayModule {}
