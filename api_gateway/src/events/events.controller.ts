import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors, Request, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../guards/role.enum';
import { Public } from '../guards/public.decorator';

@Controller("events")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  
  @Get()
  @Public()
  async getAllEvents() {
    return await this.eventsService.getAllEvents();
  }
  
  @Get('/me')
  @Roles(Role.ADMIN, Role.EVENTCREATOR)
  async findAllByCreator(@Request() req) {
    return await this.eventsService.findAllByCreator(req.user);
  }

  @Get(':id')
  @Public()
  async getEventById(@Param('id') id: number) {
    return await this.eventsService.getEventById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.EVENTCREATOR)
  @UseInterceptors(FilesInterceptor('images'))
  async createEvent(@Body() event:any, @UploadedFiles() files: Express.Multer.File[], @Request() req) {
    return await this.eventsService.createEvent(event,files,req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.EVENTCREATOR)
  async updateEventById(@Param('id') id: number, @Body() event:any, @Request() req) {
    return await this.eventsService.updateEventById(id, event, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.EVENTCREATOR)
  async deleteEventById(@Param('id') id: number, @Request() req) {
    return await this.eventsService.deleteEventById(id, req.user);
  }

}
