import { Body, Controller, Delete, Get, Param, Patch, UseGuards, Request, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../guards/role.enum';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@Post()
@Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'This route allows for the creation of a new user.',
  })
  @ApiBody({
    description: 'The data needed to create a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        firstname: { type: 'string', example: 'John' },
        lastname: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john.doe@example.com' },
        role: { type: 'string', example: 'user' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request, validation failed or invalid data',
  })
  async create(@Body() createUserDto: any) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiBearerAuth('Authorization')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users', description: 'Retrieve all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Users retrieved successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              firstname: { type: 'string', example: 'John' },
              lastname: { type: 'string', example: 'Doe' },
              email: { type: 'string', example: 'john.doe@example.com' },
              role: { type: 'string', example: 'user' }
            }
          }
        }
      }
    }
  })
  async getAllUsers(@Request() req) {
    return await this.usersService.getAllUsers(req.user);
  }

  @Get(':id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Get user by ID', description: 'Retrieve a specific user by ID' })
  @ApiParam({ name: 'id', required: true, description: 'User ID (number)', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'User retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            firstname: { type: 'string', example: 'John' },
            lastname: { type: 'string', example: 'Doe' },
            email: { type: 'string', example: 'john.doe@example.com' },
            role: { type: 'string', example: 'user' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(Role.ADMIN, Role.USER, Role.EVENTCREATOR)
  async getUserById(@Param('id') id: number, @Request() req) {
    return await this.usersService.getUserById(id, req.user);
  }

  @Patch(':id')
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Update user', description: 'Update user information' })
  @ApiParam({ name: 'id', required: true, description: 'User ID (number)', type: 'number' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstname: { type: 'string', example: 'John Updated' },
        lastname: { type: 'string', example: 'Doe Updated' },
        role: { type: 'string', example: 'admin' }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'User updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            firstname: { type: 'string', example: 'John Updated' },
            lastname: { type: 'string', example: 'Doe Updated' },
            email: { type: 'string', example: 'john.doe@example.com' },
            role: { type: 'string', example: 'admin' }
          }
        }
      }
    }
  })
  @Roles(Role.ADMIN, Role.USER, Role.EVENTCREATOR)
  async updateUserById(@Param('id') id: number, @Body() updateUser: any, @Request() req) {
    return await this.usersService.updateUserById(id, updateUser, req.user);
  }

  @Delete(':id')
  @ApiBearerAuth('Authorization')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete user', description: 'Delete a user (Admin only)' })
  @ApiParam({ name: 'id', required: true, description: 'User ID (number)', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'User deleted successfully' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUserById(@Param('id') id: number, @Request() req) {
    return await this.usersService.deleteUserById(id, req.user);
  }
}
