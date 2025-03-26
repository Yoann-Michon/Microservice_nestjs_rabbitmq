import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressService } from './address.service';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Address } from './entities/address.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private addressService: AddressService,
  ) { }
  
    async create(createEventDto: CreateEventDto): Promise<Event> {
      const startDate = new Date(createEventDto.startDate);
      const endDate = new Date(createEventDto.endDate);
      
      if (startDate >= endDate) {
        throw new BadRequestException('Start date must be before end date');
      }
  
      if (createEventDto.availableSeat > createEventDto.maxCapacity) {
        throw new BadRequestException('Available seats cannot exceed maximum capacity');
      }
  
      let address: Address;
      try {
        address = await this.addressService.create(createEventDto.address);
      } catch (error) {
        throw new BadRequestException('Unable to create address');
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
        address,
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
    const events = await this.eventRepository.find({
      relations: ['address']
    });

    return events ? events.filter(event => event.isActive === true): [];
  }

  async findOne(id: number): Promise<Event | null> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['address']
    });
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

    if (updateEventDto.address) {
      await this.addressService.update(event.address.id, { ...updateEventDto.address, id: event.address.id });
    }

    return await this.eventRepository.save(this.eventRepository.merge(event, updateEventDto));
  }

  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    await this.eventRepository.remove(event);
    if (event.address) {
      await this.addressService.remove(event.address.id);
    }
  }
}
