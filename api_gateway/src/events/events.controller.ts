import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors, Request, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../guards/roles.decorator';
import { Role } from '../guards/role.enum';
import { Public } from '../guards/public.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Events')
@Controller("events")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all events', description: 'Retrieve all events (Public access)' })
  @ApiResponse({
    status: 200,
    description: 'List of all events',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Events retrieved successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Concert' },
              description: { type: 'string', example: 'Live concert event' },
              startDate: { type: 'string', format: 'date-time', example: '2025-03-27T19:00:00Z' },
              endDate: { type: 'string', format: 'date-time', example: '2025-03-27T22:00:00Z' },
              address: { type: 'string', example: '123 Main St, City' },
              price: { type: 'number', example: 25.50 },
              maxCapacity: { type: 'number', example: 100 },
              availableSeat: { type: 'number', example: 50 },
              createdBy: { type: 'number', example: 1 },
              creationDate: { type: 'string', format: 'date-time', example: '2025-03-01T10:00:00Z' },
              isActive: { type: 'boolean', example: true },
              images: { type: 'array', items: { type: 'string', example: 'image_url_1.jpg' } }
            }
          }
        }
      }
    }
  })
  async getAllEvents() {
    return await this.eventsService.getAllEvents();
  }

  @Get('/me')
  @ApiBearerAuth('Authorization')
  @Roles(Role.ADMIN, Role.EVENTCREATOR)
  @ApiOperation({ summary: 'Get all events created by the user', description: 'Retrieve all events created by the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'List of events created by the logged-in user',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Events retrieved successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Concert' },
              description: { type: 'string', example: 'Live concert event' },
              startDate: { type: 'string', format: 'date-time', example: '2025-03-27T19:00:00Z' },
              endDate: { type: 'string', format: 'date-time', example: '2025-03-27T22:00:00Z' },
              address: { type: 'string', example: '123 Main St, City' },
              price: { type: 'number', example: 25.50 },
              maxCapacity: { type: 'number', example: 100 },
              availableSeat: { type: 'number', example: 50 },
              createdBy: { type: 'number', example: 1 },
              creationDate: { type: 'string', format: 'date-time', example: '2025-03-01T10:00:00Z' },
              isActive: { type: 'boolean', example: true },
              images: { type: 'array', items: { type: 'string', example: 'image_url_1.jpg' } }
            }
          }
        }
      }
    }
  })
  async findAllByCreator(@Request() req) {
    return await this.eventsService.findAllByCreator(req.user);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get event by ID', description: 'Retrieve a specific event by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Event ID (number)', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Event found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Event retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Concert' },
            description: { type: 'string', example: 'Live concert event' },
            startDate: { type: 'string', format: 'date-time', example: '2025-03-27T19:00:00Z' },
            endDate: { type: 'string', format: 'date-time', example: '2025-03-27T22:00:00Z' },
            address: { type: 'string', example: '123 Main St, City' },
            price: { type: 'number', example: 25.50 },
            maxCapacity: { type: 'number', example: 100 },
            availableSeat: { type: 'number', example: 50 },
            createdBy: { type: 'number', example: 1 },
            creationDate: { type: 'string', format: 'date-time', example: '2025-03-01T10:00:00Z' },
            isActive: { type: 'boolean', example: true },
            images: { type: 'array', items: { type: 'string', example: 'image_url_1.jpg' } }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getEventById(@Param('id') id: number) {
    return await this.eventsService.getEventById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.EVENTCREATOR)
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FilesInterceptor('images'))
  @ApiOperation({ summary: 'Create event', description: 'Create a new event' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Concert' },
        description: { type: 'string', example: 'Live concert event' },
        startDate: { type: 'string', format: 'date-time', example: '2025-03-27T19:00:00Z' },
        endDate: { type: 'string', format: 'date-time', example: '2025-03-27T22:00:00Z' },
        address: { type: 'string', example: '123 Main St, City' },
        price: { type: 'number', example: 25.50 },
        maxCapacity: { type: 'number', example: 100 },
        images: {
          type: 'array',
          items: {
            type: 'string',
            example: 'image_url_1.jpg'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 201 },
        message: { type: 'string', example: 'Event created successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Concert' },
            description: { type: 'string', example: 'Live concert event' },
            startDate: { type: 'string', format: 'date-time', example: '2025-03-27T19:00:00Z' },
            endDate: { type: 'string', format: 'date-time', example: '2025-03-27T22:00:00Z' },
            address: { type: 'string', example: '123 Main St, City' },
            price: { type: 'number', example: 25.50 },
            maxCapacity: { type: 'number', example: 100 },
            availableSeat: { type: 'number', example: 100 },
            createdBy: { type: 'number', example: 1 },
            creationDate: { type: 'string', format: 'date-time', example: '2025-03-01T10:00:00Z' },
            isActive: { type: 'boolean', example: true },
            images: { type: 'array', items: { type: 'string', example: 'image_url_1.jpg' } }
          }
        }
      }
    }
  })
  async createEvent(@Body() event: any, @UploadedFiles() files: Express.Multer.File[], @Request() req) {
    return await this.eventsService.createEvent(event, files, req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.EVENTCREATOR)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Update event', description: 'Update an existing event by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Event ID (number)', type: 'number' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Concert' },
        description: { type: 'string', example: 'Live concert event' },
        startDate: { type: 'string', format: 'date-time', example: '2025-03-27T19:00:00Z' },
        endDate: { type: 'string', format: 'date-time', example: '2025-03-27T22:00:00Z' },
        address: { type: 'string', example: '123 Main St, City' },
        price: { type: 'number', example: 25.50 },
        maxCapacity: { type: 'number', example: 100 }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Event updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Concert' },
            description: { type: 'string', example: 'Live concert event' },
            startDate: { type: 'string', format: 'date-time', example: '2025-03-27T19:00:00Z' },
            endDate: { type: 'string', format: 'date-time', example: '2025-03-27T22:00:00Z' },
            address: { type: 'string', example: '123 Main St, City' },
            price: { type: 'number', example: 25.50 },
            maxCapacity: { type: 'number', example: 100 },
            availableSeat: { type: 'number', example: 50 },
            createdBy: { type: 'number', example: 1 },
            creationDate: { type: 'string', format: 'date-time', example: '2025-03-01T10:00:00Z' },
            isActive: { type: 'boolean', example: true },
            images: { type: 'array', items: { type: 'string', example: 'image_url_1.jpg' } }
          }
        }
      }
    }
  })
  async updateEventById(@Param('id') id: number, @Body() updateEvent: any, @Request() req) {
    return await this.eventsService.updateEventById(id, updateEvent, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.EVENTCREATOR)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'Delete event', description: 'Delete an event by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Event ID (number)', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Event deleted successfully' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async deleteEventById(@Param('id') id: number, @Request() req) {
    return await this.eventsService.deleteEventById(id, req.user);
  }
}
