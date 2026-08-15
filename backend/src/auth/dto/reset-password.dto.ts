import { IsEmail, IsNotEmpty, IsStrongPassword, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP must contain only digits' })
  otp!: string;

  @IsNotEmpty({ message: 'New password is required' })
  @IsStrongPassword(
    { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    { message: 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a symbol' },
  )
  newPassword!: string;
}