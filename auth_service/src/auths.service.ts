import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUserDto } from './dto/login.dto';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthsService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(loginUserDto: LoginUserDto) {
    try {
      const user = await this.userClient.send('validateUser', loginUserDto).toPromise();
      
      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }


  async login(loginDto: LoginUserDto) {
    try {
      const user = await this.validateUser(loginDto);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return {
        token: this.jwtService.sign(user),
        message: 'Login successful',
      };
    } catch (error) {
      throw new Error('Error during login');
    }
  }

  async register(createAuthDto: CreateAuthDto) {
    try {
      return this.userClient.send('createUser', createAuthDto);
    } catch (error) {
      throw new InternalServerErrorException(`Error during user registration: ${error.message}`);
    }
  }

  async validateToken(token: string) {
    try {
      const decoded = await this.jwtService.verify(token);
      const user = await this.userClient.send('findUserById', decoded.sub).toPromise();
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

}