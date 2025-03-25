import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Address } from './address.entity';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false, type: 'timestamp' })
    startDate: Date;

    @Column({ nullable: false, type: 'timestamp' })
    endDate: Date;

    @OneToOne(() => Address, { cascade: true, eager: true })
    @JoinColumn()
    address: Address;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: false })
    maxCapacity: number;

    @Column({ nullable: false })
    availableSeat: number;

    @Column({ nullable: false })
    createdBy: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    creationDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column('simple-array')
    images: string[];
}
