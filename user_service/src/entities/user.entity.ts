import { Entity, PrimaryGeneratedColumn, Column, Unique} from 'typeorm';
import { Role } from './role.enum';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}

