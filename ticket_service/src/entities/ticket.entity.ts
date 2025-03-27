import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Payment } from './payment.entity';
import { Status } from './status.enum';

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

  @Column({ type: 'enum', enum: Status, default: Status.RESERVED })
  status: Status;

  @OneToMany(() => Payment, (payment) => payment.ticket)
  payments: Payment[]; 
}
