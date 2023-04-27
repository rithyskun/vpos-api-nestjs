import { IsEmail } from 'class-validator';

export class SignupDto {
  @IsEmail()
  destination: string;
}
