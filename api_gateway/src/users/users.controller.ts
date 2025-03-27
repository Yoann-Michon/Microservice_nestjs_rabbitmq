import { Body, Controller, Delete, Get, Param, Patch,UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../guards/role.enum';

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,

  ) {}
  @Get()
  @Roles(Role.ADMIN)
  async getAllUsers(@Request() req) {
    return await this.usersService.getAllUsers(req.user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER, Role.EVENTCREATOR)
  async getUserById(@Param('id') id: number, @Request() req) {
    return await this.usersService.getUserById(id,req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER, Role.EVENTCREATOR)
  async updateUserById(@Param('id') id: number, @Body() updateUser:any, @Request() req) {
    return await this.usersService.updateUserById(id, updateUser, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteUserById(@Param('id') id: number, @Request() req) {
    return await this.usersService.deleteUserById(id, req.user);
  }
}
