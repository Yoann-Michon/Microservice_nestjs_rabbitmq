import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ApisService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authServiceClient: ClientProxy,
  ) {}

  async login(login:any) {
    return await this.authServiceClient.send('login', login).toPromise();
  }

  async register(register:any) {
    return await this.authServiceClient.send('register', register).toPromise();
  }
}
