import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { log } from 'console';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) { }
  
    async create(createEventDto: CreateEventDto): Promise<Event> {
      const startDate = new Date(createEventDto.startDate);
      const endDate = new Date(createEventDto.endDate);
      
      if (startDate > endDate) {
        throw new BadRequestException('Start date must be before end date');
      }
  
      if (createEventDto.availableSeat > createEventDto.maxCapacity) {
        throw new BadRequestException('Available seats cannot exceed maximum capacity');
      }

  
      const existingEvent = await this.eventRepository.findOne({
        where: { 
          name: createEventDto.name,
          startDate: startDate,
        }
      });
  
      if (existingEvent) {
        throw new ConflictException('A similar event already exists');
      }
  
      const eventData: Partial<Event> = {
        ...createEventDto,
        creationDate: new Date(),
        startDate,
        endDate,
      };
  
      const event = this.eventRepository.create(eventData);
      
      try {
        return await this.eventRepository.save(event);
      } catch (error) {
        throw new BadRequestException('Unable to create event');
      }
    }


  async findAll(): Promise<Event[] | []> {
    const events = await this.eventRepository.find();

    return events ? events.filter(event => event.isActive === true): [];
  }

  async findOne(id: number): Promise<Event | null> {
    const event = await this.eventRepository.findOneBy({id});
    return event;
  }

  async update(id:number,updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (updateEventDto.startDate && updateEventDto.endDate &&
      updateEventDto.startDate >= updateEventDto.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    return await this.eventRepository.save(this.eventRepository.merge(event, updateEventDto));
  }

  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    await this.eventRepository.remove(event);
  }

  async findAllByCreator(creatorId: number): Promise<Event[]> {
    return await this.eventRepository.find({
      where: {
        createdBy: creatorId, 
      },
    });
  }
}
