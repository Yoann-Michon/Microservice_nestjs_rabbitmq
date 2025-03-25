import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthsService } from '../auths.service';
import { LoginUserDto } from 'src/dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthsService) {
    super({ usernameField: 'email' }); 
  }

  async validate(loginUserDto: LoginUserDto) {
    try {
      const user = await this.authService.validateUser(loginUserDto);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  
}
