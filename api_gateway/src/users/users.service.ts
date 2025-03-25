import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async getAllUsers() {
    return await this.userServiceClient.send('findAllUsers', {}).toPromise();
  }

  async getUserById(id: number) {
    return await this.userServiceClient.send('findUserById', id).toPromise();
  }

  async updateUserById(id: number, user:any) {
    return await this.userServiceClient.send('updateUser', {id, ...user}).toPromise();
  }

  async deleteUserById(id: number) {
    return await this.userServiceClient.send('removeUser', id).toPromise();
  }
}
