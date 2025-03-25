import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Payment } from './payment.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;  

  @Column()
  userId: number;

  @Column()
  eventId: number;

  @Column()
  ticketNumber: string; 

  @Column({ default: 'reserved' })
  status: string;

  @OneToMany(() => Payment, (payment) => payment.ticket)
  payments: Payment[]; 
}
