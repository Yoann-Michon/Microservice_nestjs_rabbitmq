import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthsService } from './auths.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller("auths")
export class AuthsController {
  constructor(private readonly authsService: AuthsService) {}

  @MessagePattern('login')
  async login(@Payload() loginUserDto: LoginUserDto) {
    console.log("----authservice login----");
    console.log(loginUserDto);
    return await this.authsService.login(loginUserDto);
  }

  @MessagePattern('register')
  async register(@Payload() createAuthDto: CreateAuthDto) {
    console.log("----authservice createdto----");
    console.log(createAuthDto);
    return await this.authsService.register(createAuthDto);
  }

  @MessagePattern("validate_token")
  async validateToken(@Payload() token: string) {
    return await this.authsService.validateToken(token);
  }
}
