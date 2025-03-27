import { Injectable, BadRequestException, InternalServerErrorException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { Payment } from './entities/payment.entity';
import { v4 as uuidv4 } from 'uuid';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Status } from './entities/status.enum';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @Inject('NOTIFICATION_SERVICE') private notificationServiceClient: ClientProxy,
  ) {}

  async createTicket(createTicketDto: CreateTicketDto) {
    const ticket = this.ticketRepository.create({
      userId: createTicketDto.userId,
      eventId: createTicketDto.eventId,
      ticketNumber: uuidv4()
    });
    
    return await this.ticketRepository.save(ticket);
  }

  async updateTicket(updateTicketDto: UpdateTicketDto) {
    const ticket = await this.ticketRepository.findOne({ where: { id: updateTicketDto.id } });
    
    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }


    const updatedTicket = {...ticket, ...UpdateTicketDto}
    return await this.ticketRepository.save(updatedTicket);
  }

  async processPayment(ticket: Ticket, paymentData: { amount: number; user: any; event: any }) {
    const { amount, user, event } = paymentData;

    const paymentSuccess = true;
    
    if (!paymentSuccess) {
      throw new InternalServerErrorException('Payment failed');
    }

    const payment = this.paymentRepository.create({
      amount: amount,
      method: 'card',
      paymentDate: new Date(),
      ticket: ticket,
      ticketId: ticket.id
    });
    await this.paymentRepository.save(payment);

    ticket.status = Status.PAID;
    await this.ticketRepository.save(ticket);

    this.notificationServiceClient.emit('createNotification', {
      notification: {
        to: user.email,
        subject: 'Payment Successful - Ticket Purchase Confirmation',
      },
      event: {
        name: event.name,
        startDate: event.startDate,
        ticketPrice: amount,
        ticketNumber:ticket.ticketNumber
      },
    });

    return { 
      message: 'Payment successful', 
      payment:{
        paymentId: payment.id,
        ticketPrice: amount,
      }
    };
  }

  async validateTicket(ticketId: number) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });

    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }

    if (ticket.status !== Status.PAID) {
      throw new BadRequestException('Ticket is not valid for use');
    }

    ticket.status = Status.USED;
    await this.ticketRepository.save(ticket);
    return ticket;
  }

  async findTicketById(ticketId: number) {
    return this.ticketRepository.findOne({ 
      where: { id: ticketId },
      relations: ['payments'] 
    });
  }

  async findUserTickets(userId: number) {
    return this.ticketRepository.find({ 
      where: { userId },
      relations: ['payments']
    });
  }

  async findEventTickets(eventId: number) {
    return this.ticketRepository.find({ 
      where: { eventId },
      relations: ['payments']
    });
  }
}