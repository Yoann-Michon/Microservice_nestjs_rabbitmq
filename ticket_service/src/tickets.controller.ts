import { Controller, BadRequestException, ForbiddenException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Role } from './entities/role.enum';

@Controller()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @MessagePattern('createTicket')
async createTicket(@Payload() payload: { event:any ,user:any}) {
  return await this.ticketsService.createTicket(payload.event,payload.user);
}

  @MessagePattern('updateTicket')
  async updateTicket(@Payload() payload: { updateTicketDto: UpdateTicketDto, user: any }) {
    return await this.ticketsService.updateTicket(payload.updateTicketDto, payload.user);
  }

  //todo
  @MessagePattern('processPayment')
  async processPayment(@Payload() payload: { paymenData:any, user: any}) {    
    return await this.ticketsService.processPayment(payload.paymenData, payload.user);
  }

  @MessagePattern('validateTicket')
  async validateTicket(@Payload() payload: { ticketId: number; user: any }) {
    return await this.ticketsService.validateTicket(payload.ticketId);
  }

  @MessagePattern('findTicketById')
  async findTicketById(@Payload() payload: { id: number; user: any }) {
    return await this.ticketsService.findTicketById(payload.id, payload.user);
  }

  @MessagePattern('findUserTickets')
  async findUserTickets(@Payload() user:any) {
    return await this.ticketsService.findUserTickets(user.id);
  }

  @MessagePattern('findEventTickets')
  async findEventTickets(@Payload() payload: { id: number; user: any }) {
    if (payload.user.role !== Role.ADMIN && payload.user.role !== Role.EVENTCREATOR) {
      throw new ForbiddenException('Access denied: Only admins and event creators can view event tickets');
    }
    return await this.ticketsService.findEventTickets(payload.id);
  }

  @MessagePattern('deleteTicket')
  async deleteTicket(@Payload() payload: { id: number; user: any }) {
    if (payload.user.role !== Role.ADMIN && payload.user.role !== Role.EVENTCREATOR) {
      throw new ForbiddenException('Access denied: Only admins and event creators can delete event tickets');
    }
    return await this.ticketsService.deleteTicket(payload.id, payload.user);
  }
}
