import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getAllEvents() {
    return await this.eventsService.getAllEvents();
  }

  @Get(':id')
  async getEventById(@Param('id') id: number) {
    return await this.eventsService.getEventById(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createEvent(@Body() event:any, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.eventsService.createEvent(event,files);
  }

  @Patch(':id')
  async updateEventById(@Param('id') id: number, @Body() event:any) {
    return await this.eventsService.updateEventById(id, event);
  }

  @Delete(':id')
  async deleteEventById(@Param('id') id: number) {
    return await this.eventsService.deleteEventById(id);
  }
}
