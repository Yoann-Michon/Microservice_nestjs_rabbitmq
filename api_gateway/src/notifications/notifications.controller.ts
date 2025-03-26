import { Controller, Get, UseGuards} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../guards/role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Controller("notifications")
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService

  ) {}
  @Get()
  @Roles(Role.ADMIN)
  async getAllNotifications() {
    return await this.notificationsService.getAllNotifications();
  }
}
