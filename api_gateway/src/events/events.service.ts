import { BadRequestException, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UploadPictureService } from '@upload/upload-picture';
import { log } from 'console';

@Injectable()
export class EventsService {
    constructor(@Inject("EVENT_SERVICE") private readonly eventsServiceClient: ClientProxy,
        private readonly imgBBService: UploadPictureService,
    ) { }

    async getAllEvents() {
        return await this.eventsServiceClient.send('findAllEvents', {}).toPromise();
    }

    async getEventById(id: number, user: any) {
        return await this.eventsServiceClient.send('findOneEvent', { id, user }).toPromise();
    }

    async createEvent(event: any, files: Express.Multer.File[], user: any) {
        log("----------EVENT SERVICE----------");

        if (!files || files.length === 0) {
            throw new BadRequestException('At least one image is required');
        }
        log("files: ",files)
        const imageUrls = await this.imgBBService.uploadImages(files);
        console.log("imageUrls: ", imageUrls);

        if (!imageUrls || imageUrls.length === 0) {
            throw new BadRequestException('Failed to upload images');
        }
        event.images = imageUrls;
        log("--------------------");
        log("event: ", event);

        log("--------------------");

        return await this.eventsServiceClient.send('createEvent', { event, user }).toPromise();
    }

    async updateEventById(id: number, event: any, user: any) {
        return await this.eventsServiceClient.send('updateEvent', { id, event, user }).toPromise();
    }

    async deleteEventById(id: number, user: any) {
        return await this.eventsServiceClient.send('removeEvent', { id, user }).toPromise();
    }
}