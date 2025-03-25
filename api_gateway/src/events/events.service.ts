import { BadRequestException, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UploadPictureService } from '@upload/upload-picture';

@Injectable()
export class EventsService{
    constructor(@Inject("EVENT_SERVICE") private readonly eventsServiceClient: ClientProxy,
    private readonly imgBBService: UploadPictureService,
) {}

    async getAllEvents(){
        return await this.eventsServiceClient.send('findAllEvents', {}).toPromise();
    }

    async getEventById(id: number){
        return await this.eventsServiceClient.send('findOneEvent', id).toPromise();
    }

    async createEvent(event: any, files: Express.Multer.File[]){

        if (!files || files.length === 0) {
            throw new BadRequestException('At least one image is required');
          }
    
          const imageUrls = await this.imgBBService.uploadImages(files);
    
          if (!imageUrls || imageUrls.length === 0) {
            throw new BadRequestException('Failed to upload images');
          }
          event.images = imageUrls;
        return await this.eventsServiceClient.send('createEvent', event).toPromise();
    }

    async updateEventById(id: number, event: any){
        return await this.eventsServiceClient.send('updateEvent', {id, ...event}).toPromise();
    }

    async deleteEventById(id: number){
        return await this.eventsServiceClient.send('removeEvent', id).toPromise();
    }
}