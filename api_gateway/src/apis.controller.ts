import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApisService } from './apis.service';

@Controller()
export class ApisController {
  constructor(private readonly apisService: ApisService,
  ) {}

  //auths
  @Post('auth/login')
  async login(@Body() login:any) {
    return await this.apisService.login(login);
  }

  @Post('auth/register')
  async register(@Body() register:any) {
    return await this.apisService.register(register);
  }
}
