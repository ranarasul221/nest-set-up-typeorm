import { IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  email!: string;
  otp: string;
  newPassword!: string;
}