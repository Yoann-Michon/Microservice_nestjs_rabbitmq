import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Role } from './entities/role.enum';
import { log } from 'console';

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventService) {}

  @MessagePattern('createEvent')
  async create(@Payload() payload:{event: CreateEventDto,user:any}) {

    const { event, user } = payload;

    if (user.role !== Role.ADMIN && user.role !== Role.EVENTCREATOR) {
      throw new RpcException({
        status: HttpStatus.FORBIDDEN,
        message: 'Access denied',
      });
    }

    try {
      await this.eventsService.create(event);
      return {
        statusCode: HttpStatus.OK,
        message: 'Event created successfully',
        event,
      };
    } catch (error) {
      throw new RpcException({
        code: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error?.message || 'Error while creating event',
        details: error?.details || '',
      });
    }
  }

  @MessagePattern('findAllEvents')
  async findAll() {
    return await this.eventsService.findAll();
  }

  @MessagePattern('findOneEvent')
  async findOne(@Payload() id:number) {
    try {
      const event = await this.eventsService.findOne(id);

      if (!event) {
        throw new RpcException({
          code: HttpStatus.NOT_FOUND,
          message: `Event with id ${id} not found`,
        });
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Event found successfully',
        event,
      };
    } catch (error) {
      throw new RpcException({
        code: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error?.message || 'Error while retrieving event',
        details: error?.details || '',
      });
    }
  }

  @MessagePattern('updateEvent')
  async update(@Payload() payload: {id:number, updateEvent: UpdateEventDto,user: any}) {
    const { id, updateEvent, user } = payload;

    if (user.role !== Role.ADMIN && user.role !== Role.EVENTCREATOR) {
      throw new RpcException({
        status: HttpStatus.FORBIDDEN,
        message: 'Access denied',
      });
    }
    
    if (user.role === Role.EVENTCREATOR && user.id !== updateEvent.createdBy) {
      throw new RpcException({
        status: HttpStatus.FORBIDDEN,
        message: 'Event creators can only update their own events',
      });
    }
    
    try {
      const updatedEvent = await this.eventsService.update(id,updateEvent);

      if (!updatedEvent) {
        throw new RpcException({
          code: HttpStatus.NOT_FOUND,
          message: `Event with id ${id} not found`,
        });
      }

      return {
        code: HttpStatus.OK,
        message: 'Event updated successfully',
        updatedEvent,
      };
    } catch (error) {
      throw new RpcException({
        code: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error?.message || 'Error while updating event',
        details: error?.details || '',
      });
    }
  }

  @MessagePattern('removeEvent')
  async remove(@Payload() payload: { id: number; user: any }) {
    const { id, user } = payload;

    if (user.role !== Role.ADMIN && user.role !== Role.EVENTCREATOR) {
      throw new RpcException({
        status: HttpStatus.FORBIDDEN,
        message: 'Access denied',
      });
    }

    try {
      const event = await this.findOne(id);

      if (user.role === Role.EVENTCREATOR && user.id !== event.event.createdBy) {
        throw new RpcException({
          status: HttpStatus.FORBIDDEN,
          message: 'Event creators can only delete their own events',
        });
      }

      await this.eventsService.remove(id);

      return {
        code: HttpStatus.OK,
        message: 'Event removed successfully',
      };
    } catch (error) {
      throw new RpcException({
        code: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error?.message || 'Error while deleting event',
        details: error?.details || '',
      });
    }
  }

  @MessagePattern('findAllByCreator')
  async findAllByCreator(@Payload() id: number){
    return await this.eventsService.findAllByCreator(id);
  }
}
