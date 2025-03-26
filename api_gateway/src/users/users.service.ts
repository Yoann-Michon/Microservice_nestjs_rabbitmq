import { Injectable} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  async getAllUsers(user: any) {
    return await this.userServiceClient.send('findAllUsers', user).toPromise();
  }

  async getUserById(id: number,user: any) {
    return await this.userServiceClient.send('findUserById', {id, user}).toPromise();;  }

  async updateUserById(id: number, updateUser:any, user: any) {
    return await this.userServiceClient.send('updateUser', {id, updateUser,user}).toPromise();
  }

  async deleteUserById(id: number, user: any) {
    return await this.userServiceClient.send('removeUser', {id, user}).toPromise();
  }
}
