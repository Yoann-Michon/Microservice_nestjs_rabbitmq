import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { log } from 'console';

@Injectable()
export class UploadPictureService {
    async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
        try {
          log("--------UPLOAD----------")
          if (!files || files.length === 0) {
            throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
          }
          
          const uploadedUrls: string[] = [];
      
          for (const file of files) {
            
            const formData = new FormData();
            const blob = new Blob([file.buffer], { type: file.mimetype });
            formData.append('images', blob, file.originalname);
      
            log("formData: ", formData)
            const response = await fetch(`${process.env.IMGBB_URL}?key=${process.env.IMGBB_KEY}`, {
              method: 'POST',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
      
            const data = await response.json();
            log("data: ",data)
            if (!response.ok || !data.success) {
              throw new HttpException(
                data.error?.message || 'Failed to upload image to ImgBB',
                response.status || HttpStatus.BAD_REQUEST
              );
            }
      
            uploadedUrls.push(data.data.url);
          }
      
          return uploadedUrls;
      
        } catch (error) {
          throw new HttpException(
            error.message || 'Error uploading images',
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      }
}
