// src/timeline/timeline.module.ts
import { Module, Global } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { TimelineController } from './timeline.controller';
import { PrismaService } from '../prisma/prisma.service';

// @Global() makes it available everywhere without importing it in every single module's imports array
@Global() 
@Module({
  controllers: [TimelineController],
  providers: [TimelineService, PrismaService],
  exports: [TimelineService], 
})
export class TimelineModule {}