import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { IsEmail, IsEnum, isEnum, IsNotEmpty, IsOptional, Length, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from 'src/entities/role.enum';

export class CreateUserDto {

    @IsNotEmpty()
    @Length(6, 50)
    @Matches(/.*[A-Z].*/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/.*[0-9].*/, { message: 'Password must contain at least one number' })
    @Matches(/.*[!@#$%^&*].*/, { message: 'Password must contain at least one special character' })
    password: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'The email is invalid' })
    email: string;

    @IsNotEmpty()
    @Length(3, 50)
    firstName: string;

    @IsNotEmpty()
    @Length(3, 50)
    lastName: string;

    @IsOptional()
    @IsEnum(Role)
    role: string;
}