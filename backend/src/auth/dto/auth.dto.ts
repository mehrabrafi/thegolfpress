import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(128, { message: 'Password must be at most 128 characters long' })
    password: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
