import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller("notifications")
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService

  ) {}
  @Get()
  async getAllNotifications() {
    return await this.notificationsService.getAllNotifications();
  }
}
