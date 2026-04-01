import { Module } from '@nestjs/common';
import { VitalEventsController } from './vital-events.controller';
import { VitalEventsService } from './vital-events.service';

@Module({
  controllers: [VitalEventsController],
  providers: [VitalEventsService],
})
export class VitalEventsModule {}
