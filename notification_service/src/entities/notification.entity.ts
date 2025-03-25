import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Status } from './status.enum';

@Entity("Notification")
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: false })
    to: string;
  
    @Column({ nullable: false })
    from: string;
  
    @Column({ nullable: false })
    subject: string;

    @Column({ nullable: true })
    template: string;
  
    @Column({ type: 'enum', enum: Status, default: Status.PENDING })
    status: string;
  
    @CreateDateColumn()
    sentAt: Date;
}
