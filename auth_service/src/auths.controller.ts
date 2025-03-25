import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthsService } from './auths.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller("auths")
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @MessagePattern('login')
  async login(@Payload() LoginUserDto: LoginUserDto) {
    console.log("----authservice login----");
    
    return await this.authsService.login(LoginUserDto);
  }

  @MessagePattern('register')
  async register(@Payload() createAuthDto: CreateAuthDto) {
    console.log("----authservice createdto----");
    console.log(createAuthDto);
    return await this.authsService.register(createAuthDto);
  }
}
