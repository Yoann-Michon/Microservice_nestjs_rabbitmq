import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Patch, 
    Post, 
    UseGuards, 
    Request, 
  } from '@nestjs/common';
  import { TicketService } from './ticket.service';
  import { JwtAuthGuard } from '../guards/jwt-auth.guard';
  import { RolesGuard } from '../guards/roles.guard';
  import { Roles } from '../guards/roles.decorator';
  import { Role } from '../guards/role.enum';
  
  @Controller("tickets")
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class TicketsController {
    constructor(private readonly ticketsService: TicketService) {}
  
    @Get('/me')
    async findUserTickets(@Request() req) {
      return await this.ticketsService.findUserTickets(req.user.id);
    }
  
    @Get('/event/:id')
    @Roles(Role.ADMIN, Role.EVENTCREATOR)
    async findEventTickets(
      @Param('id') id: number, 
      @Request() req
    ) {
      return await this.ticketsService.findEventTickets(id, req.user);
    }
  
    @Get(':id')
    @Roles(Role.ADMIN, Role.EVENTCREATOR,Role.USER)
    async getTicketById(
      @Param('id') id: number, 
      @Request() req
    ) {
      return await this.ticketsService.findTicketById(id, req.user);
    }
  
    @Post()
    async createTicket(
      @Body() event: any, 
      @Request() req
    ) {
      return await this.ticketsService.createTicket(event, req.user);
    }
  
    @Post('/payment')
    async processPayment(
      @Body() paymentData: any, 
      @Request() req
    ) {
      return await this.ticketsService.processPayment(paymentData,req.user);
    }
  
    @Patch(':id')
    @Roles(Role.ADMIN)
    async updateTicket(
      @Param('id') id: number, 
      @Body() ticketData: any, 
      @Request() req
    ) {
      return await this.ticketsService.updateTicket(id, ticketData, req.user);
    }
  
    @Delete(':id')
    @Roles(Role.ADMIN)
    async deleteTicket(
      @Param('id') id: number, 
      @Request() req
    ) {
      return await this.ticketsService.deleteTicket(id, req.user);
    }
  
    @Post('/validate/:id')
    @Roles(Role.ADMIN, Role.EVENTCREATOR)
    async validateTicket(
      @Param('id') id: number, 
      @Request() req
    ) {
      return await this.ticketsService.validateTicket(id, req.user);
    }
  }