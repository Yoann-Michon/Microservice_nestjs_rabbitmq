import { 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  MaxLength 
} from "class-validator";

export class CreateAddressDto {
    @IsNotEmpty({ message: 'Street is required' })
    @IsString({ message: 'Street must be a string' })
    @MinLength(3, { message: 'Street must be at least 3 characters long' })
    @MaxLength(100, { message: 'Street must not exceed 100 characters' })
    street: string;
  
    @IsNotEmpty({ message: 'City is required' })
    @IsString({ message: 'City must be a string' })
    @MinLength(2, { message: 'City must be at least 2 characters long' })
    @MaxLength(50, { message: 'City must not exceed 50 characters' })
    city: string;
  
    @IsNotEmpty({ message: 'Country is required' })
    @IsString({ message: 'Country must be a string' })
    @MinLength(2, { message: 'Country must be at least 2 characters long' })
    @MaxLength(50, { message: 'Country must not exceed 50 characters' })
    country: string;
  
    @IsNotEmpty({ message: 'Zipcode is required' })
    @IsString({ message: 'Zipcode must be a string' })
    @MinLength(4, { message: 'Zipcode must be at least 4 characters long' })
    @MaxLength(20, { message: 'Zipcode must not exceed 20 characters' })
    zipCode: string;
}