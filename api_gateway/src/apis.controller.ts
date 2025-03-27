import { Body, Controller, Post} from '@nestjs/common';
import { ApisService } from './apis.service';
import { Public } from './guards/public.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller("auth")
export class ApisController {
  constructor(private readonly apisService: ApisService,
  ) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        password: 'password',
      },
    },
  })
  async login(@Body() login:any) {
    return await this.apisService.login(login);
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        id: '1',
        email: 'user@example.com',
        firstname: 'John',
        lastname: 'Doe',
        role: 'user',
        pseudo: 'Jonny'
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        password: 'password',
        firstname: 'John',
        lastname: 'Doe',
        pseudo: 'Jonny'
      },
    },
  })
  async register(@Body() register:any) {
    return await this.apisService.register(register);
  }
}
