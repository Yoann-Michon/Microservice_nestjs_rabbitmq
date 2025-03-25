import { Injectable, BadRequestException, InternalServerErrorException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { v4 as uuidv4 } from 'uuid';
import { Payment } from './entities/payment.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @Inject('NOTIFICATION_SERVICE') private notificationServiceClient: ClientProxy,
  ) {}

  async bookTicket(userId: number, event: any) {
    const ticket = this.ticketRepository.create({
      userId,
      eventId: event.id,
      ticketNumber: uuidv4(),
    });
    
    return await this.ticketRepository.save(ticket);;
  }

  async getTicketById(ticketId: number) {
    return this.ticketRepository.findOne({ where: { id: ticketId } });
  }

  async getUserTickets(userId: number) {
    return this.ticketRepository.find({ where: { userId } });
  }

  async getUsersForEvent(eventId: number): Promise<number[]> {

    const tickets = await this.ticketRepository.find({
      where: { eventId },
      select: ['userId'],
    });

    const userIds = [...new Set(tickets.map(ticket => ticket.userId))];

    return userIds;
  }

  async validateTicket(ticketId: number) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });

    if (!ticket) {
      throw new BadRequestException('Ticket not found');
    }

    if (ticket.status !== 'reserved') {
      throw new BadRequestException('Ticket already used or invalid');
    }

    ticket.status = 'used';
    await this.ticketRepository.save(ticket);
    return ticket;
  }

  async payForTicket(data: { user: any; event: any; amount: number }): Promise<any> {
    const { user, event, amount } = data;
    const ticket = this.ticketRepository.create({
      userId: user.id,
      eventId: event.id,
      ticketNumber: uuidv4(),
      status: 'reserved',
    });
    await this.ticketRepository.save(ticket);

    if (ticket.status !== 'reserved') {
      throw new BadRequestException('Ticket is not available for payment');
    }

    const paymentSuccess = true;
    if (!paymentSuccess) {
      throw new InternalServerErrorException('Payment failed');
    }

    const payment = this.paymentRepository.create({
      amount: amount,
      paymentDate: new Date(),
      ticket,
    });
    await this.paymentRepository.save(payment);

    ticket.status = 'paid';
    await this.ticketRepository.save(ticket);

    this.notificationServiceClient.emit('createNotification', {
      notification: {
        to: user.email,
        subject: 'Payment Successful - Your Ticket Purchase Confirmation',
      },
      event: {
        name: event.name,
        startDate: event.startDate,
        customerName: event.customerName,
        ticketPrice: event.ticketPrice,
        orderId: event.orderId,
      },
    });

    return { message: 'Payment successful', paymentId: payment.id };
  }
}
