import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from './entities/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.findOneByEmail(createUserDto.email);
      if (existingUser) {
        throw new BadRequestException('User already exists');
      }
      console.log("existingUser:", existingUser);
      

      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        Number(process.env.SALT),
      );
      
      const user = new User();
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;
      user.email = createUserDto.email;
      user.password = hashedPassword;
      
      console.log("user:", user);
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating user: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<User[] | []> {
    try {      
      return await this.usersRepository.find() || [];
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({ where: { email } }) || null;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error finding user: ${error.message}`);
    }
  }
  
  async findOneById(id: number): Promise<User | null> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return user;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error finding user: ${error.message}`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOneById(id);
      
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const updatedUser = { ...user, ...updateUserDto, role: updateUserDto.role as Role };
      
      return await this.usersRepository.save(updatedUser);
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error updating user: ${error.message}`);
    }
  }

  async remove(id: number): Promise<string> {
    try {
      const user = await this.findOneById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.usersRepository.delete({ id });
      return `User with id ${id} deleted`;
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException(`Error deleting user: ${error.message}`);
    }
  }

  async validateUser(email: string, password: string): Promise<User| null> {
    try {
      const user = await this.findOneByEmail(email);
      
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
    } catch (error) {
      throw new InternalServerErrorException(`Error validating user: ${error.message}`);
    }
  }
}
