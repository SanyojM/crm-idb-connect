// src/auth/auth.controller.ts
import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  /**
   * POST /auth/login
   * @param req The request object
   * @param loginDto The email/password from the body
   */
  @Public()
  @UseGuards(AuthGuard('local')) // <-- This triggers the LocalStrategy
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    // If LocalStrategy passes, req.user is populated.
    // We just need to sign the token.
    return this.authService.login(req.user);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.otp);
  }

  // @UseGuards(JwtAuthGuard)
  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
  }

  @Get('me')
  async me(@GetUser() user: any) {
    return this.authService.getCurrentSession(user);
  }

  @Public()
  @Post('student-panel/exchange')
  async exchangeStudentPanelToken(@Body('staff_token') staffToken: string) {
    return this.authService.exchangeStudentPanelStaffToken(staffToken);
  }

}
