import {
    IsNotEmpty,
    IsString,
    IsDate,
    IsNumber,
    IsBoolean,
    ValidateNested,
    IsOptional,
    IsArray
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
    @IsNotEmpty({ message: 'Event name is required' })
    @IsString()
    name: string;

    @IsNotEmpty({ message: 'Description required' })
    @IsString()
    description: string;

    @IsNotEmpty({ message: 'Start date required' })
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @IsNotEmpty({ message: 'End date is required' })
    @IsDate()
    @Type(() => Date)
    endDate: Date;

    @IsNotEmpty({ message: 'Address is required' })
    @IsString()
    address: string;

    @IsNotEmpty({ message: 'Price is required' })
    @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @IsNotEmpty({ message: 'Maximum capacity is required' })
    @IsNumber()
    maxCapacity: number;

    @IsOptional()
    @IsNotEmpty({ message: 'Number of available seats required' })
    @IsNumber()
    availableSeat: number;

    @IsNotEmpty({ message: 'Creator ID is required' })
    @IsString()
    createdBy: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean = true;

    @IsString()
    @IsArray()
    @IsOptional()
    images: string[];
}