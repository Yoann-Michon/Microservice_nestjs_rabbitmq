import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,

  ) {}
  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return await this.usersService.getUserById(id);
  }

  @Patch(':id')
  async updateUserById(@Param('id') id: number, @Body() user:any) {
    return await this.usersService.updateUserById(id, user);
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: number) {
    return await this.usersService.deleteUserById(id);
  }
}
