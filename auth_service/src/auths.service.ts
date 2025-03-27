import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
        return { message: 'Invalid credentials' };
      }

      return {
        token: this.jwtService.sign(user),
        message: 'Login successful',
      };
    } catch (error) {
      return { message: 'Error during login: ' + error.message };
    }
  }

  async register(createAuthDto: CreateAuthDto) {
    try {
      await this.userClient.send('createUser', createAuthDto).toPromise();
      return {
        message: 'User created successfully',
      };
    } catch (error) {
      return { message: 'Error during registration: ' + error.message };
    }
  }

  async validateToken(token: string) {
    try {
      const decoded = await this.jwtService.verify(token);

      const user={
        id: decoded.id,
        email:decoded.email,
        firstname: decoded.firstname,
        lastname: decoded.lastname,
        role: decoded.role,}
      
      const existingUser = await this.userClient.send('findUserById', { id: decoded.id, user }).toPromise();
      
      return existingUser;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

}