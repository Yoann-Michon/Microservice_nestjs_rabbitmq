import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Event } from './event.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  street: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  country: string;

  @Column({ nullable: false })
  zipCode: string;

  @OneToOne(() => Event, (event) => event.address)
  event: Event;
}
