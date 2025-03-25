import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../entities/status.enum';

export class CreateNotificationDto {
    @IsEmail()
    @IsNotEmpty()
    to: string;

    @IsEmail()
    @IsNotEmpty()
    from: string;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    template: string;

    @IsEnum(Status)
    @IsNotEmpty()
    status: Status = Status.PENDING;
}
