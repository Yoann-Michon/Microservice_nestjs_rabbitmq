import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventService) {}

  @MessagePattern('createEvent')
  async create(@Payload() createEventDto: CreateEventDto) {
    return await this.eventsService.create(createEventDto);
  }

  @MessagePattern('findAllEvents')
  async findAll() {
    return await this.eventsService.findAll();
  }

  @MessagePattern('findOneEvent')
  async findOne(@Payload() id: number) {
    return await this.eventsService.findOne(id);
  }

  @MessagePattern('updateEvent')
  async update(@Payload() updateEventDto: UpdateEventDto) {
    return await this.eventsService.update(updateEventDto);
  }

  @MessagePattern('removeEvent')
  async remove(@Payload() id: number) {
    return await this.eventsService.remove(id);
  }
}
