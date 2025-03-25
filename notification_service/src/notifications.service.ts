import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { ticketPurchaseTemplate } from './template/event_purchase';
import { Status } from './entities/status.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  private async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: to,
      subject: subject,
      html: body,
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending email: ', error);
      return false;
    }
  }

  async create(createNotificationDto: CreateNotificationDto, Event:{name: string, startDate: string, customerName: string, ticketPrice: number, orderId: string}): Promise<Notification> {
    const emailBody = ticketPurchaseTemplate(
      Event.name,
      Event.startDate,
      Event.customerName,
      Event.ticketPrice,
      Event.orderId,
    );

    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      template: emailBody,
    });

    const emailSent = await this.sendEmail(createNotificationDto.to, createNotificationDto.subject, emailBody);

    if (emailSent) {
      notification.status = Status.SUCCESS;
    } else {
      notification.status = Status.ERROR;
    }

    
    return await this.notificationRepository.save(notification);
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationRepository.find();
  }
}
