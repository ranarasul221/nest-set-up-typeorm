import { IsEmail } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  email!: string;
  otp!: string;
}