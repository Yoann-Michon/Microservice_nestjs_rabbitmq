import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern('createNotification')
  async create(@Payload() data: { notification: CreateNotificationDto, event: {name: string, startDate: string, customerName: string, ticketPrice: number, orderId: string} }) {
    const { notification, event } = data;
    return await this.notificationsService.create(notification, event);
  }

  @MessagePattern('findAllNotifications')
  async findAll() {
    return await this.notificationsService.findAll();
  }

}
