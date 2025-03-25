import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TicketsService } from './tickets.service';

@Controller()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @MessagePattern('bookTicket')
  async bookTicket(@Payload() data: { userId: number; eventId: number }) {
    return await this.ticketsService.bookTicket(data.userId, data.eventId);
  }

  @MessagePattern('getTicketById')
  async getTicketById(@Payload() ticketId: number) {
    return await this.ticketsService.getTicketById(ticketId);
  }

  @MessagePattern('getUserTickets')
  async getUserTickets(@Payload() userId: number) {
    return await this.ticketsService.getUserTickets(userId);
  }

  @MessagePattern('getUsersForEvent')
  async getUsersForEvent(@Payload() eventId: number) {
    return await this.ticketsService.getUsersForEvent(eventId);
  }

  @MessagePattern('validateTicket')
  async validateTicket(@Payload() ticketId: number) {
    return await this.ticketsService.validateTicket(ticketId);
  }

  @MessagePattern('payForTicket')
  async payForTicket(@Payload() data: { user: any; event: any; amount: number }) {
    return await this.ticketsService.payForTicket(data);
  }
}
