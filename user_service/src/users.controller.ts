import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('createUser')
  @HttpCode(HttpStatus.CREATED) 
  async create(@Payload() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      user,
    };
  }

  @MessagePattern('findAllUsers')
  @HttpCode(HttpStatus.OK) 
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      message: 'Users retrieved successfully',
      users,
    };
  }

  @MessagePattern('findUserById')
  @HttpCode(HttpStatus.OK) 
  async findOneById(@Payload() id: number) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      return {
        message: `User with id ${id} not found`,
        user: null,
      };
    }
    return {
      message: 'User found successfully',
      user,
    };
  }

  @MessagePattern('findUserByEmail')
  @HttpCode(HttpStatus.OK) 
  async findOneByEmail(@Payload() email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return {
        message: `User with email ${email} not found`,
        user: null,
      };
    }
    return {
      message: 'User found successfully',
      user,
    };
  }

  @MessagePattern('updateUser')
  @HttpCode(HttpStatus.OK) 
  async update(@Payload() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(updateUserDto.id, updateUserDto);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  @MessagePattern('removeUser')
  @HttpCode(HttpStatus.OK)
  async remove(@Payload() id: number) {
    const message = await this.usersService.remove(id);
    return {
      message,
    };
  }

  @MessagePattern('validateUser')
  @HttpCode(HttpStatus.OK)
  async validateUser(@Payload() data:{email: string, password: string}) {
    const isValid = await this.usersService.validateUser(data.email, data.password);
    return {
      isValid
    };
  }
}
