import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @MessagePattern('createTicket')
  async createTicket(@Payload() createTicketDto: CreateTicketDto) {
    return await this.ticketsService.createTicket(createTicketDto);
  }

  @MessagePattern('updateTicket')
  async updateTicket(@Payload() updateTicketDto: UpdateTicketDto) {
    return await this.ticketsService.updateTicket(updateTicketDto);
  }

  @MessagePattern('processPayment')
  async processPayment(@Payload() payload: { 
    ticketId: number, 
    amount: number, 
    user: any, 
    event: any 
  }) {
    const ticket = await this.ticketsService.findTicketById(payload.ticketId);
    
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    return await this.ticketsService.processPayment(ticket, {
      amount: payload.amount,
      user: payload.user,
      event: payload.event
    });
  }

  @MessagePattern('validateTicket')
  async validateTicket(@Payload() ticketId: number) {
    return await this.ticketsService.validateTicket(ticketId);
  }

  @MessagePattern('findTicketById')
  async findTicketById(@Payload() ticketId: number) {
    return await this.ticketsService.findTicketById(ticketId);
  }

  @MessagePattern('findUserTickets')
  async findUserTickets(@Payload() userId: number) {
    return await this.ticketsService.findUserTickets(userId);
  }

  @MessagePattern('findEventTickets')
  async findEventTickets(@Payload() eventId: number) {
    return await this.ticketsService.findEventTickets(eventId);
  }
}