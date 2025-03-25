import { Module } from '@nestjs/common';
import { UploadPictureService } from './upload-picture.service';

@Module({
  providers: [UploadPictureService],
  exports: [UploadPictureService],
})
export class UploadPictureModule {}
