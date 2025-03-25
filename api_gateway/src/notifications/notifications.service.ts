import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

export class NotificationsService{
    constructor(@Inject("NOTIFICATION_SERVICE") private readonly notificationsServiceClient: ClientProxy) {}
  
    async getAllNotifications() {
      return await this.notificationsServiceClient.send('findAllNotifications', {}).toPromise();
    }
}