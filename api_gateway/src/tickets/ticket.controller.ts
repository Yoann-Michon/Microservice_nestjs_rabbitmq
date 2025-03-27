import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../guards/role.enum';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tickets')
@Controller("tickets")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketService) {}

  @Get('/me')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Get all tickets of the current user',
    description: 'Fetch all tickets associated with the logged-in user.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tickets for the user',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          eventId: { type: 'number' },
          userId: { type: 'number' },
          status: { type: 'string' },
        },
      },
    },
  })
  async findUserTickets(@Request() req) {
    return await this.ticketsService.findUserTickets(req.user);
  }

  @Get('/event/:id')
  @Roles(Role.ADMIN, Role.EVENTCREATOR)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Get all tickets for a specific event',
    description: 'Fetch all tickets for a given event (Admin/Event Creator only).',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Event ID to fetch tickets for',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of tickets for the event',
  })
  async findEventTickets(@Param('id') id: number, @Request() req) {
    return await this.ticketsService.findEventTickets(id, req.user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.EVENTCREATOR, Role.USER)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Get ticket by ID',
    description: 'Fetch ticket details by its ID (Admin, Event Creator, or User).',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Ticket ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket details',
  })
  async getTicketById(@Param('id') id: number, @Request() req) {
    return await this.ticketsService.findTicketById(id, req.user);
  }

  @Post()
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Create a new ticket',
    description: 'Create a ticket for an event (User logged in).',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        eventId: { type: 'number' },
        userId: { type: 'number' },
        status: { type: 'string', default: 'pending' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Ticket created successfully',
  })
  async createTicket(@Body() event: any, @Request() req) {
    return await this.ticketsService.createTicket(event, req.user);
  }

  @Post('/payment')
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Process a ticket payment',
    description: 'Handle payment processing for a ticket.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ticketId: { type: 'number' },
        amount: { type: 'number' },
        method: { type: 'string', default: 'card' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Payment processed successfully',
  })
  async processPayment(@Body() paymentData: any, @Request() req) {
    return await this.ticketsService.processPayment(paymentData, req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Update ticket details',
    description: 'Update ticket information (Admin only).',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Ticket ID to update',
    type: Number,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        userId: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket updated successfully',
  })
  async updateTicket(@Param('id') id: number, @Body() ticketData: any, @Request() req) {
    return await this.ticketsService.updateTicket(id, ticketData, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Delete a ticket',
    description: 'Delete a ticket by its ID (Admin only).',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Ticket ID to delete',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket deleted successfully',
  })
  async deleteTicket(@Param('id') id: number, @Request() req) {
    return await this.ticketsService.deleteTicket(id, req.user);
  }

  @Post('/validate/:id')
  @Roles(Role.ADMIN, Role.EVENTCREATOR)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: 'Validate a ticket',
    description: 'Validate a ticket as valid (Admin/Event Creator only).',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Ticket ID to validate',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Ticket validated successfully',
  })
  async validateTicket(@Param('id') id: number, @Request() req) {
    return await this.ticketsService.validateTicket(id, req.user);
  }
}
