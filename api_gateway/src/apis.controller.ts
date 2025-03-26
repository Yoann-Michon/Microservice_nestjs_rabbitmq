import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApisService } from './apis.service';
import { Public } from './guards/public.decorator';

@Controller()
export class ApisController {
  constructor(private readonly apisService: ApisService,
  ) {}

  @Post('auth/login')
  @Public()
  async login(@Body() login:any) {
    return await this.apisService.login(login);
  }

  @Post('auth/register')
  @Public()
  async register(@Body() register:any) {
    return await this.apisService.register(register);
  }
}
