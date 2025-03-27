import { IsNotEmpty, IsNumber, IsOptional, IsString, IsIn, IsEnum } from 'class-validator';
import { Status } from '../entities/status.enum';

export class CreateTicketDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    eventId: number;

    @IsOptional()
    @IsString()
    ticketNumber: string;

    @IsOptional()
    @IsEnum(Status)
    status: Status;
}
