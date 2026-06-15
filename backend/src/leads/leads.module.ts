import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { JwtModule } from '@nestjs/jwt';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    PermissionsModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService, PermissionsGuard, Reflector],
})
export class LeadsModule {}
